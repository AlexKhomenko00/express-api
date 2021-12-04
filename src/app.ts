import express, { Request, Response, NextFunction, Express } from "express";
import { Server } from "http";
import { ExeptionFilter } from "./errors/exeption.filters";
import { LoggerService } from "./logger/logger.service";

import { UserController } from "./users/users.controller";

export class App {
	app: Express;
	server: Server;
	port: number;
	logger: LoggerService;
	userController: UserController;
	exeptionFilter: ExeptionFilter;

	constructor(
		logger: LoggerService,
		userController: UserController,
		exeptionFilter: ExeptionFilter
	) {
		this.app = express();
		this.port = 8000;
		this.logger = logger;
		this.userController = userController;
		this.exeptionFilter = exeptionFilter;
	}

	useRoutes() {
		this.app.use("/users", this.userController.router);
	}
	useExeptionFilter() {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init() {
		this.useRoutes();
		this.useExeptionFilter();

		this.server = this.app.listen(this.port);

		this.logger.log(`Server started on http://localhost.:${this.port}`);
	}
}
