"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Start seeding...');
    const adminEmail = 'admin@quickfund.com';
    const adminPassword = 'adminpassword';
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            fullName: 'QuickFund Admin',
            passwordHash: adminPasswordHash,
            role: client_1.UserRole.ADMIN,
        },
    });
    console.log('----------------------------------------');
    console.log('👤 ADMIN USER');
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('----------------------------------------');
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
            role: client_1.UserRole.USER,
        },
    });
    console.log('👤 REGULAR USER');
    console.log(`   Email:    ${regularUser.email}`);
    console.log(`   Password: ${userPassword}`);
    console.log('----------------------------------------');
    await prisma.loan.upsert({
        where: { id: 'seed-loan-01' },
        update: {},
        create: {
            id: 'seed-loan-01',
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
//# sourceMappingURL=seed.js.map