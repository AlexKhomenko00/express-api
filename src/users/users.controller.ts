import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';

import { TYPES } from '../types';

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

import { ILogger } from '../logger/logger.interface';
import { IUserController } from './users.controller.interface';
import { IUserService } from './users.service.interface';
import { IConfigService } from '../config/config.service.interface';

import { ValidateMiddleware } from '../common/validate.middleware';

import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
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
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
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

		const jwt = await this.signJWT(dto.email, this.configService.get('SECRET'));

		this.ok(res, { jwt });
	}

	async info(
		{ user: userEmail }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const user = await this.userService.getUser(userEmail);

		if (!user) {
			this.send(res, 401, 'User not found');
			return;
		}

		this.ok(res, { id: user.id, email: user.email });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{ email, iat: Math.floor(Date.now() / 100) },
				secret,
				{ algorithm: 'HS256' },
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
