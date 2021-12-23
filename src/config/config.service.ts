import { inject, injectable } from 'inversify';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';

import { TYPES } from '../types';

import { IConfigService } from './config.service.interface';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.loggerService.error('Error reading .env file or it is missing');
		} else {
			this.loggerService.log('[ConfigService] .env config loaded');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
