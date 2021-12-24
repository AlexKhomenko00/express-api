import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { TYPES } from '../types';

import { ILogger } from '../logger/logger.interface';
import { IUserController } from './users.controller.interface';
import { IUserService } from './users.service.interface';

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

import { ValidateMiddleware } from '../common/validate.middleware';

import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
		]);
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);

		if (!result) {
			return next(new HTTPError(422, 'This user already exists'));
		}

		this.ok(res, { email: result.email, id: result.id });
	}

	async login(
		{ body: dto }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const isValidUser = await this.userService.validateUser(dto);

		if (!isValidUser) {
			return next(new HTTPError(401, 'Error in authorization', 'login'));
		}

		this.ok(res, {});
	}
}
