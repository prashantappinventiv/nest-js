import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    Logger,
    OnModuleInit,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ClientGrpc } from '@nestjs/microservices';
  import { Reflector } from '@nestjs/core';
  import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE_NAME, AuthServiceClient } from 'src/types/auth';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private authService: AuthServiceClient;

  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt = request.cookies?.Authentication || request.headers?.authentication;

    if (!jwt) {
      this.logger.warn('JWT token not found');
      return of(false);
    }

    return this.authService.authenticate({ Authentication: jwt }).pipe(
      tap((res) => {
        console.log(res,"responsessssssssssss")
        request.user = { ...res, _id: res.id };
        console.log(res,"respons1111111111111111111111")
      }),
      map(() => true),
      catchError((err) => {
        this.logger.error('Authentication failed:', err);
        return of(false);
      }),
    );
  }
}
  
//   @Injectable()
//   export class JwtAuthGuard implements CanActivate, OnModuleInit {
//     private readonly logger = new Logger(JwtAuthGuard.name);
//     private authService: AuthServiceClient;
  
//     constructor(
//       @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
//       private readonly reflector: Reflector,
//     ) {}
  
//     onModuleInit() {
//       this.authService =
//         this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
//     }
  
//     canActivate(
//       context: ExecutionContext,
//     ): boolean | Promise<boolean> | Observable<boolean> {
//       const jwt =
//         context.switchToHttp().getRequest().cookies?.Authentication ||
//         context.switchToHttp().getRequest().headers?.authentication;
  
//       if (!jwt) {
//         return false;
//       }
  
//       const roles = this.reflector.get<string[]>('roles', context.getHandler());
  
//       return this.authService
//         .authenticate({
//           Authentication: jwt,
//         })
//         .pipe(
//           tap((res) => {
//             if (roles) {
//               for (const role of roles) {
//                 if (!res.roles?.includes(role)) {
//                   this.logger.error('The user does not have valid roles.');
//                   throw new UnauthorizedException();
//                 }
//               }
//             }
//             context.switchToHttp().getRequest().user = {
//               ...res,
//               _id: res.id,
//             };
//           }),
//           map(() => true),
//           catchError((err) => {
//             this.logger.error(err);
//             console.log(err,"erorrrrrrrrr")
//             return of(false);
//           }),
//         );
//     }
//   }
  