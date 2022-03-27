// ========= Admin Controller
// import all modules
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto';

@Controller('api/v1')
export class AdminController {
	constructor(private adminService: AdminService) {}

	@Post('admin')
	@UseGuards(AuthGuard)
	public createAdmin(@Request() req: Request, @Body() body: CreateAdminDto) {
		return this.adminService.createAdmin(req, body);
	}
}
