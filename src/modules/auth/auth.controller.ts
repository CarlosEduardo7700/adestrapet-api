import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ControllerResponseDto } from '../dtos/responses/controller-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() dto: LoginDto): Promise<ControllerResponseDto> {
    const response: string = await this.authService.login(dto);

    return {
      message: response,
    };
  }
}
