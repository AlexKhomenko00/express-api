import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Invalid email format.' })
	email: string;

	@IsString({ message: 'Password is required.' })
	password: string;
}
