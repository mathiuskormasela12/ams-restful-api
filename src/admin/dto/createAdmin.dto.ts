// ========== Create Admin Dto

import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAdminDto {
	@IsString({ message: 'Invalid first name' })
	@IsNotEmpty({ message: "The first name can't be empty" })
	firstName: string;

	@IsString({ message: 'Invalid last name' })
	@IsOptional()
	lastName: string;

	@IsEmail({ message: 'Invalid last name' })
	@IsNotEmpty({ message: "The email can't be empty" })
	email: string;

	@IsString({ message: 'Invalid password' })
	@IsNotEmpty({ message: "The password can't be empty" })
	password: string;

	@IsString({ message: 'Invalid password comfirmation' })
	@IsNotEmpty({ message: "The password confirmation can't be empty" })
	passwordConfirmation: string;
}
