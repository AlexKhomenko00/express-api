import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { TYPES } from '../types';

import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';

import { User } from './user.entity';

import { IUserService } from './users.service.interface';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.ConfigServie) private configService: IConfigService) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		await newUser.setPassoword(password);
		return null;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
