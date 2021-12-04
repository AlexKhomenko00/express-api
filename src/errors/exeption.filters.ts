import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../logger/logger.service";
import { IExeptionFilter } from "./exeption.filter.interface";
import { HTTPError } from "./http-error.class";

export class ExeptionFilter implements IExeptionFilter {
	logger: LoggerService;
	constructor(logger: LoggerService) {
		this.logger = logger;
	}
	catch(
		error: Error | HTTPError,
		req: Request,
		res: Response,
		next: NextFunction
	) {
		if (error instanceof HTTPError) {
			this.logger.error(
				`[${error.context}] Error ${error.statusCode} : ${error.message}`
			);
			res.status(error.statusCode).send({ err: error.message });
		} else {
			this.logger.error(`${error.message}`);
			res.status(500).send({ err: error.message });
		}
	}
}
