// ========== Admin Services
// import all modules

import { Injectable, Body, Request, HttpStatus } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './dto';
import { response, responseGenerator } from '../helpers';

@Injectable()
export class AdminService {
	constructor(private prisma: PrismaService) {}

	public async createAdmin(
		@Request() req: Request,
		@Body() body: CreateAdminDto,
	) {
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
								firstName: body.firstName,
								lastName: body.lastName,
								email: body.email,
								password: hashed,
								type: 'ADMIN',
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
							'The new admin is created successfully',
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
}
