// ========== Auth Service
// import all modules
import {
	HttpStatus,
	Injectable,
	Request,
	Body,
	HttpCode,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { response } from '../helpers';
import { ValidationPipe } from './auth.pipe';
import { RegisterDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService,
	) {}

	public async register(
		@Request() req: Request,
		@Body(new ValidationPipe()) body: RegisterDto,
	): Promise<any> {
		if (body.password !== body.passwordConfirmation) {
			HttpCode(HttpStatus.BAD_REQUEST);
			return response(
				req.url,
				HttpStatus.BAD_REQUEST,
				false,
				"The password and the confirmation password don't match",
			);
		}

		try {
			const isExists = await this.prisma.user.findFirst({
				where: {
					email: body.email,
				},
			});

			if (isExists) {
				HttpCode(HttpStatus.BAD_REQUEST);
				return response(
					req.url,
					HttpStatus.BAD_REQUEST,
					true,
					'The email is already in used',
				);
			} else {
				try {
					const hashed = await argon.hash(body.password);
					try {
						const results = await this.prisma.user.create({
							data: {
								email: body.email,
								password: hashed,
							},
						});

						delete results.firstName;
						delete results.lastName;
						delete results.photo;
						delete results.password;
						delete results.type;

						HttpCode(HttpStatus.CREATED);
						return response(
							req.url,
							HttpStatus.CREATED,
							true,
							'Registration successfully',
							results,
						);
					} catch (err) {
						HttpCode(HttpStatus.INTERNAL_SERVER_ERROR);
						return response(
							req.url,
							HttpStatus.INTERNAL_SERVER_ERROR,
							false,
							err.message,
						);
					}
				} catch (err) {
					HttpCode(HttpStatus.INTERNAL_SERVER_ERROR);
					return response(
						req.url,
						HttpStatus.INTERNAL_SERVER_ERROR,
						false,
						err.message,
					);
				}
			}
		} catch (err) {
			HttpCode(HttpStatus.INTERNAL_SERVER_ERROR);
			return response(
				req.url,
				HttpStatus.INTERNAL_SERVER_ERROR,
				false,
				err.message,
			);
		}
	}
}
