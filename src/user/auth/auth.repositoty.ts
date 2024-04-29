import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AbstractRepository } from 'src/database/abstract.repository';
import { UserDocument } from 'src/models/user.schema';

@Injectable()
export class AuthRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(AuthRepository.name);

  constructor(@InjectModel(UserDocument.name) authModel: Model<UserDocument>) {
    super(authModel);
  }
}