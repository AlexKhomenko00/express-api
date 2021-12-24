import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';

import { TYPES } from './types';

import { IExeptionFilter } from './errors/exeption.filter.interface';
import { IUserController } from './users/users.controller.interface';
import { IUserService } from './users/users.service.interface';
import { ILogger } from './logger/logger.interface';

import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { ExeptionFilter } from './errors/exeption.filters';
import { UserController } from './users/users.controller';
import { UserService } from './users/users.service';
import { IConfigService } from './config/config.service.interface';

import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBingings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope;
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);
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
