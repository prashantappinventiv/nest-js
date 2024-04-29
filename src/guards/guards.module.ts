import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GuardService } from './guards.service';
import { BasicStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { CONSTANT } from 'src/common/constant';
import { HttpResponse } from 'src/common/httpResponse';
import { JwtStrategy } from './jwt.strategy';
import { ClientOnBoardingService } from 'src/modules/client/on-boarding/on-boarding.service';
import { UsersRepository } from 'src/modules/client/on-boarding/user.repository';
import { UserDocument, UserSchema } from 'src/model/user.schema';
import { DatabaseModule } from 'src/providers/database';


@Module({
  imports: [
    JwtModule.register({
      secret: CONSTANT.JWT_PASSWORD,
    }),
    PassportModule,DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  providers: [GuardService, JwtStrategy, HttpResponse, BasicStrategy,ClientOnBoardingService,UsersRepository,UserDocument],
  exports: [JwtModule],
})
export class GuardModule {}
