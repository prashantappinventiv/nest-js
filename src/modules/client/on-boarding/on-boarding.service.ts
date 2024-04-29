import { ConflictException, Injectable } from '@nestjs/common';
import { ClientEntity } from 'src/entity/client.entity';
import { CreateOnboardingDto } from './dto/on-boarding.dto';
import { ENUM } from 'src/common/enum';
import { RESPONSE_DATA } from 'src/common/responses';
import { generateOtp } from 'src/common/utils';
import { GuardService } from 'src/guards/guards.service';
import { CONSTANT } from 'src/common/constant';
import moment from 'moment';

@Injectable()
export class ClientOnBoardingService {
  constructor(
    private readonly clientEntity: ClientEntity,
    private readonly guardService: GuardService,
  ) {}

  async signUp(createOnboardingDto: CreateOnboardingDto) {
    try {
      createOnboardingDto.password = this.guardService.hashData(
        createOnboardingDto.password,
        CONSTANT.PASSWORD_HASH_SALT,
      );

      const createClient = Object.assign(createOnboardingDto);

      const data = await this.clientEntity.create(createClient);

      return [RESPONSE_DATA.SUCCESS, { id: data._id }];
    } catch (error) {
      console.log('Error in signUp:---------->', error);
      return [RESPONSE_DATA.ERROR, {}];
    }
  }
}
