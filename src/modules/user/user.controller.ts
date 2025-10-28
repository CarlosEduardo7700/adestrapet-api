import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ControllerResponseDto } from '../dtos/responses/controller-response.dto';
import { RegisterUserDto } from './dto/requests/register-user.dto';
import { UserDetailsDto } from './dto/responses/user-details.dto';
import { UserListDto } from './dto/responses/user-list.dto';

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

  @Get()
  async getUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ControllerResponseDto> {
    const users: UserListDto[] = await this.userService.getUsers(page, limit);

    return {
      message: `Quantidade de usuários encontrados: ${users.length}.`,
      data: users,
    };
  }
}
