import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HttpResponse } from 'src/common/httpResponse';
import { ClientOnBoardingService } from './on-boarding.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateOnboardingDto } from './dto/on-boarding.dto';

@ApiTags('Client : OnBoarding')
@Controller('/')
export class ClientOnBoardingController {
  constructor(
    private readonly httpResponse: HttpResponse,
    private readonly clientOnBoardingService: ClientOnBoardingService,
  ) {}

  @Post('/signup')
  @ApiOperation({ summary: 'sign api' })
  @ApiBasicAuth()
  @UseGuards(AuthGuard('basic'))
  async signup(
    @Body() createOnboardingDto: CreateOnboardingDto,
    @Res() response: Response,
  ) {
    try {
      const [status, result] =
      await this.clientOnBoardingService.signUp(createOnboardingDto);
    return this.httpResponse.sendResponse(response, status, result);
    } catch (error) {
      throw error;
    }
    
  }
}
