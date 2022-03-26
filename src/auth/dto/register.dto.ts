// ========== Register Dto

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
	@IsEmail({ message: 'Invalid email' })
	@IsNotEmpty({ message: "The email can't be empty" })
	email: string;

	@IsString({ message: 'Invalid password' })
	@IsNotEmpty({ message: "The password can't be empty" })
	password: string;

	@IsString({ message: 'Invalid password confirmation' })
	@IsNotEmpty({ message: "The password confirmation can't be empty" })
	passwordConfirmation: string;
}
