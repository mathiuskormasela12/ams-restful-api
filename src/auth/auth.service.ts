// ========== Auth Service
// import all modules
import { HttpStatus, Injectable, Request, Body } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { response, errorResponse } from '../helpers';
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
			throw errorResponse(
				HttpStatus.BAD_REQUEST,
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
				throw response(
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

						return response(
							req.url,
							HttpStatus.CREATED,
							true,
							'Registration successfully',
							results,
						);
					} catch (err) {
						throw errorResponse(err.status, err.message);
					}
				} catch (err) {
					throw errorResponse(err.status, err.message);
				}
			}
		} catch (err) {
			throw errorResponse(err.status, err.message);
		}
	}
}
