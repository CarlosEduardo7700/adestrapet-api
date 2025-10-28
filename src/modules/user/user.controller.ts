import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ControllerResponseDto } from '../dtos/responses/controller-response.dto';
import { RegisterUserDto } from './dto/requests/register-user.dto';
import { UserDetailsDto } from './dto/responses/user-details.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async resgisterUser(
    @Body() dto: RegisterUserDto,
  ): Promise<ControllerResponseDto> {
    const userDetails: UserDetailsDto =
      await this.userService.resgisterUser(dto);

    return {
      message: 'Usuário cadastrado com sucesso!',
      data: userDetails,
    };
  }
}
