// import { Module } from '@nestjs/common';
// import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

// @Module({
//   imports: [
//     PinoLoggerModule.forRoot({
//       pinoHttp: {
//         transport: {
//           target: 'pino-pretty',
//           options: {
//             singleLine: true,
//           },
//         },
//       },
//     }),
//   ],
// })
// export class LoggerModule {}
import { Module } from '@nestjs/common';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as moment from 'moment';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { LOGGER_NAME } from 'src/constants/services';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new DailyRotateFile({
          filename: process.cwd() + '/logs/Combined.log',
          datePattern: 'YYYY-MM-DD',
          level: 'info',
          maxSize: '5m',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(LOGGER_NAME.LOGGER, {
              colors: true,
              prettyPrint: true,
            }),
            winston.format.printf((info: any) => `${info.level}: ${[info.timestamp]} ${info.message} }`)
          ),
        }),
        new DailyRotateFile({
          filename: process.cwd() + '/logs/Errors-' + moment().format('MMMM-YYYY') + '.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxSize: '5m',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(LOGGER_NAME.LOGGER, {
              colors: true,
              prettyPrint: true,
            }),
            winston.format.printf(
              (info: any) => `${info.level}: ${[info.timestamp]}: API ENDPOINT ${info.message} MESSAGE ${info.stack ? info.stack : 'NO ERROR'}`
            )
          ),
        }),
      ],
    }),
  ],
})
export class LoggerModule {}
