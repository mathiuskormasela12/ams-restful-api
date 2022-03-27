// ========== Auth Guards
// import all modules
import {
	CanActivate,
	ExecutionContext,
	HttpStatus,
	Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { response } from '../helpers';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwt: JwtService, private config: ConfigService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		const token = request.headers['x-access-token'];
		const secret = this.config.get('JWT_ACCESS_TOKEN_KEY');

		if (token) {
			try {
				const decode = await this.jwt.verify(token, { secret });
				request.app.locals.decode = decode;
				return true;
			} catch (err) {
				throw response({
					status: HttpStatus.BAD_REQUEST,
					success: false,
					message: err.message,
				});
			}
		} else {
			throw response({
				status: HttpStatus.BAD_REQUEST,
				success: false,
				message: 'Forbidden',
			});
		}
	}
}
