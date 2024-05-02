import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ClientOnBoardingService } from './on-boarding.service';
import { DatabaseModule } from 'src/providers/database';
import { UserDocument, UserSchema } from 'src/model/user.schema';
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME } from 'src/types/auth';
import { GuardModule } from 'src/guards/guards.module';
import { ClientOnBoardingController } from './on-boarding.controller';
import { GuardService } from 'src/guards/guards.service';
import { HttpResponse } from 'src/common/httpResponse';
import { JwtStrategy } from 'src/guards/jwt.strategy';
import { UsersRepository } from './user.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: AUTH_PACKAGE_NAME,
            protoPath: join('/home/sky/Desktop/SONNY-CRM-PROJECT/auth/auth.proto'), // Assuming proto files are in a relative path to this module
            url: 'localhost:5001', // Assuming AUTH_GRPC_URL is in the environment variables
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    GuardModule,
  ],
  controllers: [ClientOnBoardingController],
  providers: [
    ClientOnBoardingService,
    GuardService,
    HttpResponse,
    JwtStrategy,
    UsersRepository,
  ],
  exports: [ClientOnBoardingService],
})
export class ClientOnBoardingModule {}
