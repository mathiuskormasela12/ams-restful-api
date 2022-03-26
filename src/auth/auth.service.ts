// ========== Auth Service
// import all modules
import { HttpStatus, Injectable, Request } from '@nestjs/common';
import { response } from '../helpers';

@Injectable()
export class AuthService {
	public register(@Request() req: Request) {
		response(req.url, HttpStatus.OK, true, 'Berhasil', [], 10, 5);
	}
}
