import { NextFunction, Request, Response } from 'express';

import { verify } from 'jsonwebtoken';

import { IMiddleWare } from './middleware.inteface';

export class AuthMiddleware implements IMiddleWare {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];

			verify(token, this.secret, (err, payload) => {
				if (err) {
					next();
				} else if (payload) {
					req.user = payload.email;

					next();
				}
			});
		}

		next();
	}
}
