import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, errors, splat, json, colorize, printf } = winston.format;

export const winstonLoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp(),
        nestWinstonModuleUtilities.format.nestLike('ExcellencesAPI', {
          prettyPrint: true,
        }),
      ),
    }),
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: combine(timestamp(), errors({ stack: true }), splat(), json()),
    }),
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'error-%DATE%.log',
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: combine(
        timestamp(),
        errors({ stack: true }),
        splat(),
        printf(({ timestamp: ts, level, message, stack }) => {
          return `${ts} [${level}] ${stack || message}`;
        }),
      ),
    }),
  ],
};
