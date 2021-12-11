import 'reflect-metadata';
import express, { Express } from 'express';
import { json } from 'body-parser';

import { inject, injectable } from 'inversify';

import { ExeptionFilter } from './errors/exeption.filters';
import { ILogger } from './logger/logger.interface';

import { TYPES } from './types';
import { Server } from 'http';

import { UserController } from './users/users.controller';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExeptionFilter(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilter();

		this.server = this.app.listen(this.port);

		this.logger.log(`Server started on http://localhost.:${this.port}`);
	}
}
