// ========== Auth Service
// import all modules
import { HttpStatus, Injectable, Request, Body } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { responseGenerator, response } from '../helpers';
import { ValidationPipe } from './auth.pipe';
import { RegisterDto, LoginDto } from './dto';
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
			throw responseGenerator(
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
				throw responseGenerator(
					req.url,
					HttpStatus.BAD_REQUEST,
					false,
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

						return responseGenerator(
							req.url,
							HttpStatus.CREATED,
							true,
							'Registration successfully',
							results,
						);
					} catch (responses) {
						throw response(responses);
					}
				} catch (responses) {
					throw response(responses);
				}
			}
		} catch (responses) {
			throw response(responses);
		}
	}

	public async login(
		@Request() req: Request,
		@Body(new ValidationPipe()) body: LoginDto,
	) {
		try {
			const isExists = await this.prisma.user.findUnique({
				where: { email: body.email },
			});

			if (
				!isExists ||
				!(await argon.verify(isExists.password, body.password))
			) {
				throw responseGenerator(
					req.url,
					HttpStatus.BAD_REQUEST,
					false,
					'Invalid email or password',
				);
			}

			const accessTokenSecretKey = this.config.get('JWT_ACCESS_TOKEN_KEY');
			const refreshTokenSecretKey = this.config.get('JWT_REFRESH_TOKEN_KEY');
			const accessToken = this.jwt.sign(
				{ id: isExists.id },
				{ expiresIn: '2m', secret: accessTokenSecretKey },
			);
			const refreshToken = this.jwt.sign(
				{ id: isExists.id },
				{ expiresIn: '5m', secret: refreshTokenSecretKey },
			);

			throw responseGenerator(
				req.url,
				HttpStatus.OK,
				true,
				'Login Successfully',
				{
					accessToken,
					refreshToken,
				},
			);
		} catch (responses) {
			throw response(responses);
		}
	}
}
