import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PROTO } from 'src/common/constant';
import { RESPONSE_DATA } from 'src/common/responses';
import { Observable, mergeMap } from 'rxjs';
import { GrpcServiceInterface } from 'src/interfaces/grpc.service.interface';
import { ResUtils } from 'src/common/grpc.response';
import { GrpcService } from './grpc.service';

@Controller('')
export class GrpcController {
  constructor(private readonly grpcService: GrpcService) {}

  /**
   * gRPC method to handle bidirectional streaming for user creation.
   * @param request$ A stream of CreateUser requests from the client.
   * @returns A stream of CreateUser responses sent back to the client.
   */
  @GrpcMethod(
    PROTO.SERVICES.USER_SERVICE.NAME,
    PROTO.SERVICES.USER_SERVICE.CREATE_USER_METHOD,
  )
  async createUser(request$: Observable<GrpcServiceInterface.ICreateUser>): Promise<Observable<{
    status: number;
    message: string;
    timestamp: number;
    data: string;
    error: string;
  }>> {
    return request$.pipe(
      mergeMap(async (data: GrpcServiceInterface.ICreateUser) => {
        try {
          console.log("inside try service of grpc")
          const responseData = await this.grpcService.createUser(data);
          if (responseData) {
            return ResUtils.grpcSuccessResponse(
              responseData,
              RESPONSE_DATA.SUCCESS,
            );
          } else {
            return ResUtils.grpcErrorResponse(responseData, RESPONSE_DATA.ERROR);
          }
        } catch (error) {
          return ResUtils.grpcErrorResponse(error, RESPONSE_DATA.ERROR);
        }
      }),
    );
  }
}
