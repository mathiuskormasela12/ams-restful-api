// ========== Login Dto
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
	@IsEmail({ message: 'Invalid email' })
	@IsNotEmpty({ message: "The email can't be empty" })
	email: string;

	@IsString({ message: 'Invalid password' })
	@IsNotEmpty({ message: "The password can't be empty" })
	password: string;
}
