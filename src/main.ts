import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';

import { TYPES } from './types';

import { IExeptionFilter } from './errors/exeption.filter.interface';

import { IUser } from './users/user.interface';
import { ILogger } from './logger/logger.interface';

import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { ExeptionFilter } from './errors/exeption.filters';
import { UserController } from './users/users.controller';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBingings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<IUser>(TYPES.UserController).to(UserController);
	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();

	appContainer.load(appBingings);

	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
