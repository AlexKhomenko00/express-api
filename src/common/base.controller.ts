import 'reflect-metadata';
import { Response, Router } from 'express';
import { injectable } from 'inversify';

import { ILogger } from '../logger/logger.interface';

import { ExpressReturnType, IControllerRoute } from './route.interface';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): ExpressReturnType {
		res.type('application/json');

		return res.status(code).json(message);
	}

	public created(res: Response): ExpressReturnType {
		return res.sendStatus(201);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 200, message);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		routes.forEach((route) => {
			this.logger.log(`[${route.method}] ${route.path}`);

			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const hanlder = route.func.bind(this);

			const pipelines = middleware ? [...middleware, hanlder] : hanlder;

			this.router[route.method](route.path, pipelines);
		});
	}
}
