// ========= Admin Controller
// import all modules
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminService } from './admin.service';

@Controller('api/v1')
export class AdminController {
	constructor(private adminService: AdminService) {}

	@Post('admin')
	@UseGuards(AuthGuard)
	public createAdmin(@Request() req: Request, @Body() body: Body) {
		return this.adminService.createAdmin(req, body);
	}
}
