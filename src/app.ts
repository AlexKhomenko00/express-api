import express, { Request, Response, NextFunction, Express } from "express";
import { Server } from "http";

import { userRouter } from "./users/users";

export class App {
	app: Express;
	server: Server;
	port: number;

	constructor() {
		this.app = express();
		this.port = 8000;
	}

	useRoutes() {
		this.app.use("/users", userRouter);
	}

	public async init() {
		this.useRoutes();
		this.server = this.app.listen(this.port);

		console.log(`Server started on http://localhost.:${this.port}`);
	}
}
