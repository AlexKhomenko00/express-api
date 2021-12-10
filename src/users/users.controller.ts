import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { ILogger } from '../logger/logger.interface';
import { LoggerService } from '../logger/logger.service';
import { TYPES } from '../types';
import { IUser } from './user.interface';

@injectable()
export class UserController extends BaseController implements IUser {
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

	register(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'Registered');
	}

	login(req: Request, res: Response, next: NextFunction): void {
		next(new HTTPError(401, 'Error in authorization', 'login'));
	}
}
