import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserRegisterDto } from 'src/dto/auth.dto';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserDocument } from 'src/models/user.schema';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() userDto: UserRegisterDto) {
    return this.authService.create(userDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() auth: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log("inside login")
    const jwt = await this.authService.login(auth, response);
    response.send(jwt);
  }
}
