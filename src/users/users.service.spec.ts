import { Container } from 'inversify';
import { UserModel } from '@prisma/client';

import { User } from './user.entity';

import { TYPES } from '../types';

import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { UserService } from './users.service';
import { IUserService } from './users.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	create: jest.fn(),
	find: jest.fn(),
};

const UserRegisterBodyMock: UserRegisterDto = {
	email: 'a@a.com',
	name: 'Mark',
	password: '1',
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UserRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UserRepository);
	usersService = container.get<IUserService>(TYPES.UserService);
});

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);

		const createdUser = await usersService.createUser(UserRegisterBodyMock);

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual(UserRegisterBodyMock.password);
	});
});
