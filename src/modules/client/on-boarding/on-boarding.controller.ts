// import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
// import {Response} from "express"
// import {
//   ApiBasicAuth,
//   ApiOperation,
//   ApiTags,
// } from '@nestjs/swagger';
// import { HttpResponse } from 'src/common/httpResponse';
// import { ClientOnBoardingService } from './on-boarding.service';
// import { AuthGuard } from '@nestjs/passport';
// import { CreateOnboardingDto } from './dto/on-boarding.dto';

// @ApiTags('Client : OnBoarding')
// @Controller('/')
// export class ClientOnBoardingController {
//   constructor(
//     private readonly httpResponse: HttpResponse,
//     private readonly clientOnBoardingService: ClientOnBoardingService,
//   ) {}

//   @Post('/signup')
//   @ApiOperation({ summary: 'sign api' })
//   @UseGuards(AuthGuard('basic'))
//   async signup(
//     @Body() createOnboardingDto: CreateOnboardingDto,
//     @Res() response: Response,
//   ) {
//     try {
//       const [status, result] =
//       await this.clientOnBoardingService.signUp(createOnboardingDto);
//     return this.httpResponse.sendResponse(response, status, result);
//     } catch (error) {
//       throw error;
//     }
//   }

//   @Get(':id')
//   async getUser(@Param('id') id: string) {
//     const user = await this.clientOnBoardingService.getUser({id }); // Assuming getUserDto has an 'id' property
//     return user;
//   }
// }

import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ClientOnBoardingService } from './on-boarding.service';
import { UserDocument } from 'src/model/user.schema';
import { JwtAuthGuard } from 'src/auth/jwt';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/on-boarding.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class ClientOnBoardingController {
  constructor(
    private readonly clientOnBoardingService: ClientOnBoardingService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<any> {
    console.log('Controller: id =', id);
    console.log('Controller: updateProfileDto =', updateProfileDto);
    return this.clientOnBoardingService.updateProfile(id, updateProfileDto);
  }
}


//   @Get()
//   @UseGuards(JwtAuthGuard)
//   async getUser(@CurrentUser() user: UserDocument) {
//     console.log('-----------', user);
//     return user;
//   }
// }
