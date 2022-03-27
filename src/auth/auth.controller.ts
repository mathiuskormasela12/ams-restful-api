// ========== Auth Controller
// import all modules
import { Body, Controller, Post, Request } from '@nestjs/common';
import { ValidationPipe } from './auth.pipe';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@Controller('api/v1')
export class AuthController {
	constructor(private authService: AuthService) {}
	@Post('auth/register')
	public register(
		@Request() req: Request,
		@Body(new ValidationPipe()) body: RegisterDto,
	) {
		return this.authService.register(req, body);
	}

	@Post('auth/login')
	public login(
		@Request() req: Request,
		@Body(new ValidationPipe()) body: LoginDto,
	) {
		return this.authService.login(req, body);
	}
}
