import winston from 'winston';

export class Logger {
    private logger: winston.Logger;

    constructor(service: string) {
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json(),
                winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
                    return JSON.stringify({
                        timestamp,
                        level,
                        service,
                        message,
                        ...meta
                    });
                })
            ),
            defaultMeta: { service },
            transports: [
                new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
                new winston.transports.File({ filename: 'logs/combined.log' }),
            ],
        });

        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple(),
                    winston.format.printf(({ timestamp, level, message, service }) => {
                        return `${timestamp} [${service}] ${level}: ${message}`;
                    })
                )
            }));
        }
    }

    info(message: string, meta?: any): void {
        this.logger.info(message, meta);
    }

    error(message: string, error?: any): void {
        this.logger.error(message, { error: error instanceof Error ? error.stack : error });
    }

    warn(message: string, meta?: any): void {
        this.logger.warn(message, meta);
    }

    debug(message: string, meta?: any): void {
        this.logger.debug(message, meta);
    }
}
