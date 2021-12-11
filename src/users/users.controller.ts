import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { TYPES } from '../types';

import { ILogger } from '../logger/logger.interface';
import { IUserController } from './users.controller.interface';

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { User } from './user.entity';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
			},
		]);
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const newUser = new User(body.email, body.name);
		await newUser.setPassoword(body.password);

		this.ok(res, { user: newUser });
	}

	login({ body }: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		next(new HTTPError(401, 'Error in authorization', 'login'));
	}
}
