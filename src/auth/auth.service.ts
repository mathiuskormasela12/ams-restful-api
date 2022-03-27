// ========== Auth Service
// import all modules
import { HttpStatus, Injectable, Request, Body, Headers } from '@nestjs/common';
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
			throw response({
				status: HttpStatus.BAD_REQUEST,
				success: false,
				message: "The password and the confirmation password don't match",
			});
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

						throw responseGenerator(
							req.url,
							HttpStatus.OK,
							true,
							'Registration successfully',
							results,
						);
					} catch (responses) {
						if (responses instanceof Error) {
							throw responseGenerator(
								req.url,
								HttpStatus.BAD_REQUEST,
								false,
								responses.message,
							);
						} else {
							throw responses;
						}
					}
				} catch (responses) {
					if (responses instanceof Error) {
						throw responseGenerator(
							req.url,
							HttpStatus.BAD_REQUEST,
							false,
							responses.message,
						);
					} else {
						throw responses;
					}
				}
			}
		} catch (responses) {
			if (responses instanceof Error) {
				throw response({
					status: HttpStatus.BAD_REQUEST,
					success: false,
					message: responses.message,
				});
			} else {
				throw response(responses);
			}
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
				{ expiresIn: '1m', secret: accessTokenSecretKey },
			);
			const refreshToken = this.jwt.sign(
				{ id: isExists.id },
				{ expiresIn: '5m', secret: refreshTokenSecretKey },
			);

			try {
				await this.prisma.authorizationToken.create({
					data: {
						refreshToken,
					},
				});

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
				if (responses instanceof Error) {
					throw responseGenerator(
						req.url,
						HttpStatus.BAD_REQUEST,
						false,
						responses.message,
					);
				} else {
					throw responses;
				}
			}
		} catch (responses) {
			if (responses instanceof Error) {
				throw response({
					status: HttpStatus.BAD_REQUEST,
					success: false,
					message: responses.message,
				});
			} else {
				throw response(responses);
			}
		}
	}

	public async createAccessToken(
		@Request() req: Request,
		@Headers() headers: Headers,
	) {
		const refreshToken = headers['x-refresh-token'];

		if (!refreshToken) {
			throw response({
				status: HttpStatus.FORBIDDEN,
				success: false,
				message: 'Forbidden',
			});
		}

		try {
			const isRefreshTokenExists =
				await this.prisma.authorizationToken.findFirst({
					where: {
						refreshToken,
					},
				});

			if (!isRefreshTokenExists) {
				throw responseGenerator(
					req.url,
					HttpStatus.NOT_FOUND,
					false,
					'The refresh token is not exists',
				);
			}

			const refreshTokenSecretKey = this.config.get('JWT_REFRESH_TOKEN_KEY');

			try {
				const decode = await this.jwt.verify(refreshToken, {
					secret: refreshTokenSecretKey,
				});

				const accessTokenSecretKey = this.config.get('JWT_ACCESS_TOKEN_KEY');

				const accessToken = this.jwt.sign(
					{ id: decode.id },
					{ secret: accessTokenSecretKey, expiresIn: '1m' },
				);
				const newRefreshToken = this.jwt.sign(
					{ id: decode.id },
					{ secret: refreshTokenSecretKey, expiresIn: '5m' },
				);

				throw responseGenerator(
					req.url,
					HttpStatus.CREATED,
					true,
					'The access token is created successfully',
					{ accessToken, refreshToken: newRefreshToken },
				);
			} catch (responses) {
				if (responses instanceof Error) {
					if (responses.message === 'jwt expired') {
						try {
							await this.prisma.authorizationToken.delete({
								where: { id: isRefreshTokenExists.id },
							});
							throw responseGenerator(
								req.url,
								HttpStatus.BAD_REQUEST,
								false,
								responses.message,
							);
						} catch (err) {
							throw responseGenerator(
								req.url,
								HttpStatus.BAD_REQUEST,
								false,
								err.message,
							);
						}
					} else {
						throw responseGenerator(
							req.url,
							HttpStatus.BAD_REQUEST,
							false,
							responses.message,
						);
					}
				} else {
					throw responses;
				}
			}
		} catch (responses) {
			if (responses instanceof Error) {
				throw response({
					status: HttpStatus.BAD_REQUEST,
					success: false,
					message: responses.message,
				});
			} else {
				throw response(responses);
			}
		}
	}
}
