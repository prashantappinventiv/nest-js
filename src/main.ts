import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AuthModule } from './user/auth/auth.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';


async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  //  app.useLogger(app.get(Logger));
  // await app.startAllMicroservices();
  const port = configService.get('HTTP_PORT') || 3000;
  await app.listen(port);
  
}
bootstrap();
