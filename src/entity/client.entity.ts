import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateOnboardingDto } from 'src/modules/client/on-boarding/dto/on-boarding.dto';
import { Dao } from 'src/providers/database/dao.provider';
import { IClient } from 'src/schema/client.schema';

@Injectable()
export class ClientEntity extends Dao {
  constructor(@Inject('CLIENT_MODEL') private clientModel: Model<IClient>) {
    super(clientModel);
  }

  async create(createUserDto: CreateOnboardingDto) {
    const user = await this.saveData(createUserDto);
    return user;
  }
}
