// quickfund-backend/prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  // --- Seed Admin User ---
  const adminEmail = 'admin@quickfund.com';
  const adminPassword = 'adminpassword';
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  // Use upsert to avoid creating duplicate admins on subsequent runs
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      // You can update fields here if the user already exists
      // For this case, we don't need to update anything.
    },
    create: {
      email: adminEmail,
      fullName: 'QuickFund Admin',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN, // Using the enum for type safety
    },
  });

  console.log('----------------------------------------');
  console.log('👤 ADMIN USER');
  console.log(`   Email:    ${admin.email}`);
  console.log(`   Password: ${adminPassword}`);
  console.log('----------------------------------------');


  // --- Seed Regular User ---
  const userEmail = 'user@quickfund.com';
  const userPassword = 'userpassword';
  const userPasswordHash = await bcrypt.hash(userPassword, 10);

  const regularUser = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      fullName: 'John Doe',
      passwordHash: userPasswordHash,
      role: UserRole.USER, // Explicitly set the role
    },
  });

  console.log('👤 REGULAR USER');
  console.log(`   Email:    ${regularUser.email}`);
  console.log(`   Password: ${userPassword}`);
  console.log('----------------------------------------');


  // --- Seed a Sample Loan for the Regular User ---
  // This makes the admin dashboard immediately useful on first run.
  await prisma.loan.upsert({
      // We use a combination of fields to make this unique enough for an upsert
      where: { id: 'seed-loan-01' },
      update: {},
      create: {
        id: 'seed-loan-01', // Use a predictable ID for the seed
        amountRequested: 5000,
        purpose: 'Emergency car repair',
        status: 'PENDING',
        score: 75,
        userId: regularUser.id,
      }
  });

  console.log('✅ Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('❌ An error occurred while seeding the database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });