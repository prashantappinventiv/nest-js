import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GrpcController } from './grpc.controller';
import { GrpcService } from './grpc.service';
import { ClientOnBoardingModule } from 'src/modules/client/on-boarding/on-boarding.module';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [GrpcController],
  providers: [GrpcService, ClientOnBoardingModule],
})
export class GrpcModule {}
