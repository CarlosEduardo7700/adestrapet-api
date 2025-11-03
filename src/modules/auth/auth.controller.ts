import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/requests/login.dto';
import { ControllerResponseDto } from '../dtos/responses/controller-response.dto';
import { LoginResponseDto } from './dto/responses/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() dto: LoginDto): Promise<ControllerResponseDto> {
    const loginResponse: LoginResponseDto = await this.authService.login(dto);

    return {
      message: 'Usuário autenticado com sucesso!',
      data: loginResponse,
    };
  }
}
