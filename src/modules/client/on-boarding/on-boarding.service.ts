// import { Injectable } from '@nestjs/common';
// import { CreateOnboardingDto, GetUserDto } from './dto/on-boarding.dto';
// import { RESPONSE_DATA } from 'src/common/responses';
// import { GuardService } from 'src/guards/guards.service';
// import { CONSTANT } from 'src/common/constant';
// import { UsersRepository } from './user.repository';

// @Injectable()
// export class ClientOnBoardingService {
//   constructor(
//     private readonly usersRepository: UsersRepository,
//     private readonly guardService: GuardService,
//   ) {}

//   async signUp(createOnboardingDto: CreateOnboardingDto) {
//     try {
//       createOnboardingDto.password = this.guardService.hashData(
//         createOnboardingDto.password,
//         CONSTANT.PASSWORD_HASH_SALT,
//       );

//       const createClient = Object.assign(createOnboardingDto);

//       await this.usersRepository.create(createClient);

//       return [RESPONSE_DATA.SUCCESS];
//     } catch (error) {
//       console.log('Error in signUp:---------->', error);
//       return [RESPONSE_DATA.ERROR, {}];
//     }
//   }

//   async getUser(getUserDto: GetUserDto) {
//     return this.usersRepository.findOne(getUserDto);
//   }
// }

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GetUserDto, UpdateProfileDto } from './dto/on-boarding.dto';
import { UsersRepository } from './user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from 'src/model/user.schema';
import mongoose, { Model } from 'mongoose';
// import { ObjectId } from 'mongoose';


@Injectable()
export class ClientOnBoardingService {
  constructor(
@InjectModel(UserDocument.name) private readonly profileModel: Model<UserDocument>,
  
private readonly usersRepository: UsersRepository,) {}

  // async create(createUserDto: CreateUserDto) {
  //   await this.validateCreateUserDto(createUserDto);
  //   return this.usersRepository.create({
  //     ...createUserDto,
  //     password: await bcrypt.hash(createUserDto.password, 10),
  //   });
  // }

  // private async validateCreateUserDto(createUserDto: CreateUserDto) {
  //   try {
  //     await this.usersRepository.findOne({ email: createUserDto.email });
  //   } catch (err) {
  //     return;
  //   }
  //   throw new UnprocessableEntityException('Email already exists.');
  // }

  // async verifyUser(email: string, password: string) {
  //   const user = await this.usersRepository.findOne({ email });
  //   const passwordIsValid = await bcrypt.compare(password, user.password);
  //   if (!passwordIsValid) {
  //     throw new UnauthorizedException('Credentials are not valid.');
  //   }
  //   return user;
  // }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }
  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    try {
      console.log(updateProfileDto); // Log the updateProfileDto
  
      // Convert the id string to a valid ObjectId instance
      const objectId = new mongoose.Types.ObjectId(id);
  
      // Perform the update operation using findByIdAndUpdate
      const updatedUser = await this.profileModel.findByIdAndUpdate(
        objectId,
        updateProfileDto,
        { new: true }
      );
  
      console.log(updatedUser); // Log the updated user
  
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
  
      return updatedUser;
    } catch (error) {
      // Handle any errors that occur during the update operation
      console.error('Error updating user profile:', error);
      throw new InternalServerErrorException('Failed to update user profile');
    }
  }
}
