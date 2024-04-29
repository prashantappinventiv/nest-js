import { Injectable } from '@nestjs/common';
import { CreateOnboardingDto, GetUserDto } from './dto/on-boarding.dto';
import { RESPONSE_DATA } from 'src/common/responses';
import { GuardService } from 'src/guards/guards.service';
import { CONSTANT } from 'src/common/constant';
import { UsersRepository } from './user.repository';

@Injectable()
export class ClientOnBoardingService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly guardService: GuardService,
  ) {}

  async signUp(createOnboardingDto: CreateOnboardingDto) {
    try {
      createOnboardingDto.password = this.guardService.hashData(
        createOnboardingDto.password,
        CONSTANT.PASSWORD_HASH_SALT,
      );

      const createClient = Object.assign(createOnboardingDto);

      const data = await this.usersRepository.create(createClient);

      return [RESPONSE_DATA.SUCCESS];
    } catch (error) {
      console.log('Error in signUp:---------->', error);
      return [RESPONSE_DATA.ERROR, {}];
    }
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }
}
