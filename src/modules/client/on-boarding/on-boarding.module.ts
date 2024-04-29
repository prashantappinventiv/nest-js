import { Module, UseFilters } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientOnBoardingService } from './on-boarding.service';
import { GuardModule } from 'src/guards/guards.module';
import { GuardService } from 'src/guards/guards.service';
import { HttpResponse } from 'src/common/httpResponse';
import { ClientOnBoardingController } from './on-boarding.controller';
import * as Joi from 'joi';
import { JwtStrategy } from 'src/guards/jwt.strategy';
import { DatabaseModule } from 'src/providers/database';
import { UserDocument, UserSchema } from 'src/model/user.schema';
import { UsersRepository } from './user.repository';

@Module({
    imports: [
      DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
      ConfigModule.forRoot({
        isGlobal: true,
        validationSchema: Joi.object({
          MONGODB_URI: Joi.string().required(),
          PORT: Joi.number().required(),
        }),
      }),
      GuardModule,DatabaseModule
    ],
    controllers: [ClientOnBoardingController],
    providers: [ClientOnBoardingService, GuardService,HttpResponse, JwtStrategy,UsersRepository,UserDocument],
    exports: [ClientOnBoardingService]
  })
  export class ClientOnBoardingModule {}
