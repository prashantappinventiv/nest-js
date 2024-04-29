import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {ClientOnBoardingService } from './on-boarding.service';
import { EntityModule } from 'src/entity/entity.module';
import { GuardModule } from 'src/guards/guards.module';
import { GuardService } from 'src/guards/guards.service';
import { HttpResponse } from 'src/common/httpResponse';
import { ClientOnBoardingController } from './on-boarding.controller';

@Module({
  imports: [ConfigModule.forRoot(),EntityModule, GuardModule],
  controllers: [ClientOnBoardingController],
  providers: [ClientOnBoardingService, GuardService, HttpResponse],
})
export class ClientOnBoardingModule {}
