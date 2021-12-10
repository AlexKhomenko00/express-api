import "reflect-metadata";
import { injectable } from "inversify";
import { Logger } from "tslog";

import { ILogger } from "./logger.interface";

@injectable()
export class LoggerService implements ILogger {
	public logger: Logger;

	constructor() {
		this.logger = new Logger({
			displayInstanceName: false,
			displayLoggerName: false,
			displayFilePath: "hidden",
		});
	}

	log(...args: unknown[]) {
		this.logger.info(...args);
	}

	error(...args: unknown[]) {
		// sent to sentry/rollbar
		this.logger.error(...args);
	}

	warn(...args: unknown[]) {
		this.logger.warn(...args);
	}
}
