// ========== Auth Service
// import all modules
import { HttpStatus, Injectable, Request, Body } from '@nestjs/common';
import { response } from '../helpers';
import { ValidationPipe } from './auth.pipe';
import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
	public register(
		@Request() req: Request,
		@Body(new ValidationPipe()) body: RegisterDto,
	) {
		console.log(body);
		response(req.url, HttpStatus.OK, true, 'Berhasil', [], 10, 5);
	}
}
