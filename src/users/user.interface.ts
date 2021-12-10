import { NextFunction, Request, Response } from 'express';

export interface IUser {
	register: (req: Request, res: Response, next: NextFunction) => void;
	login: (req: Request, res: Response, next: NextFunction) => void;
}
