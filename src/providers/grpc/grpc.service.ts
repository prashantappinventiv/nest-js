import { Injectable } from '@nestjs/common';
import { GrpcServiceInterface } from 'src/interfaces/grpc.service.interface';
import { ClientOnBoardingService } from 'src/modules/client/on-boarding/on-boarding.service';
@Injectable()
export class GrpcService {
  constructor(private readonly onboardingService: ClientOnBoardingService) {}

  /**
   * Handles the 'CreateUser' gRPC request by delegating the creation process to the UserService.
   * @param payload The data object containing information to create a user.
   * @returns A Promise resolving to the user data created by the UserService.
   * @throws If an error occurs during the user creation process, it is logged, and the error is handled.
   */

  async createUser(payload: GrpcServiceInterface.ICreateUser) {
    try {
      const userData = await this.onboardingService.signUp(payload);
      return userData;
    } catch (error) {
      console.log('error in GrpcService:---', error);
    }
  }
}
