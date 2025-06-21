import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { LoanStatus, UserRole } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AdminService } from './admin.service';

@UseGuards(AuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('loans')
  @Roles(UserRole.ADMIN) // This route requires ADMIN role
  getAllLoans() {
    return this.adminService.getAllLoans();
  }

  @Patch('loans/:id/approve')
@Roles(UserRole.ADMIN)
approveLoan(@Param('id') id: string) {
  return this.adminService.updateLoanStatus(id, LoanStatus.APPROVED); 
}

@Patch('loans/:id/reject')
@Roles(UserRole.ADMIN)
rejectLoan(@Param('id') id: string) {
  return this.adminService.updateLoanStatus(id, LoanStatus.REJECTED);
}

@Get('loans/:id')
@Roles(UserRole.ADMIN)
getLoanDetails(@Param('id') id: string) {
    return this.adminService.getLoanById(id);
}
}