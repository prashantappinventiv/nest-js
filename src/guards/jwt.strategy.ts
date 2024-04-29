import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CONSTANT } from 'src/common/constant';
import { ENUM } from 'src/common/enum';
import { RESPONSE_MSG } from 'src/common/responses';
import { ClientEntity } from 'src/entity/client.entity';

@Injectable()
export class JwtClientStrategy extends PassportStrategy(Strategy, 'clientJWT') {
  constructor(
    private readonly clientEntity: ClientEntity,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: CONSTANT.JWT_PASSWORD,
    });
  }

  async validate(payload: { clientId: string; sessionId: string }) {
    if (payload) {

      console.log('*******************   Session Validation Start For Client ******************************');

  //     const [clientData, sessionData] = await Promise.all([
  //       this.clientEntity.findOne({ _id: payload.clientId }),
  //       //this.clientSessionEntity.findOneWithRedis({ _id: payload.sessionId, status: ENUM.CLIENT_PROFILE_STATUS.ACTIVE }),
  //     ]);
  //     if (!sessionData) throw new UnauthorizedException(RESPONSE_MSG.SESSION_EXPIRED);
  //     if (!clientData) throw new UnauthorizedException(RESPONSE_MSG.CLIENT_NOT_EXIST);
  //     else if (clientData.status == ENUM.CLIENT_PROFILE_STATUS.BLOCKED) throw new ForbiddenException(RESPONSE_MSG.ACCOUNT_BLOCKED);
  //     else if (clientData.status == ENUM.CLIENT_PROFILE_STATUS.DELETED) throw new UnauthorizedException(RESPONSE_MSG.CLIENT_NOT_EXIST);

  //       const sessionClient = {
  //         sessionId: payload.sessionId,
  //         clientId: payload.clientId,
  //         clientData: {...clientData },
  //       };
  //       console.log('*******************   Session Validation End For Client ******************************');

  //       return sessionClient;
        
  //   } else throw new UnauthorizedException(RESPONSE_MSG.INVALID_AUTHORIZATION_TOKEN);
  // }
}
  }
}
