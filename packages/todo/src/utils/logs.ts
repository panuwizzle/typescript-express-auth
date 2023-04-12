import { Request, Response, NextFunction } from "express";
import { format, createLogger, transports } from "winston";
import path from 'path'

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.label({ label: path.basename(__filename) }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  defaultMeta: { service: 'auth-service' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
        )
      )
    })
  ]
})

export const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now(); 

  res.on('finish', () => {
    const elapsedTime = Date.now() - startTime;
    logger.info(`${req.method} ${req.url} ${res.statusCode} ${elapsedTime}ms`);
  });

  next();
};