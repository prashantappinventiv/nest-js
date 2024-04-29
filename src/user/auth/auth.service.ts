import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthRepository } from './auth.repositoty';
import { UserRegisterDto } from 'src/dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from 'src/models/user.schema';
import { TokenPayload } from 'src/interfaces/token-payload.interface';


@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}
  async create(userRegisterDto: UserRegisterDto) {
    await this.validateCreateUserDto(userRegisterDto);
    return this.authRepository.create({
      ...userRegisterDto,
      password: await bcrypt.hash(userRegisterDto.password, 10),
    });
  }
  private async validateCreateUserDto(userRegisterDto: UserRegisterDto) {
    try {
      await this.authRepository.findOne({ email: userRegisterDto.email });
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists.');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.authRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async login(auth: UserDocument, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: auth._id.toHexString(),
    };
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );
    const token = this.jwtService.sign(tokenPayload);
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
    return token;
  }
}
