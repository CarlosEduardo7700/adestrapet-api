import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ControllerResponseDto } from '../dtos/responses/controller-response.dto';
import { RegisterUserDto } from './dto/requests/register-user.dto';
import { UserDetailsDto } from './dto/responses/user-details.dto';
import { UserListDto } from './dto/responses/user-list.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { AuthRequest } from '../auth/interfaces/auth-request.interface';

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
      message: 'Usuário cadastrado com sucesso',
      data: userDetails,
    };
  }

  @Get()
  @UseGuards(AuthGuard)
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

  @Get('/details')
  @UseGuards(AuthGuard)
  async getUserById(
    @Req() request: AuthRequest,
  ): Promise<ControllerResponseDto> {
    const id = request.userData.id;

    const user: UserDetailsDto = await this.userService.getUserById(id);

    return {
      message: `Usuário de ID '${id}' encontrado.`,
      data: user,
    };
  }

  @Patch()
  @UseGuards(AuthGuard)
  async updateUser(
    @Req() request: AuthRequest,
    @Body() dto: UpdateUserDto,
  ): Promise<ControllerResponseDto> {
    const id = request.userData.id;

    const userDetails: UserDetailsDto = await this.userService.updateUser(
      id,
      dto,
    );

    return {
      message: `Usuário de ID '${id}' atualizado.`,
      data: userDetails,
    };
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteUser(
    @Req() request: AuthRequest,
  ): Promise<ControllerResponseDto> {
    const id = request.userData.id;

    const userDetails: UserDetailsDto = await this.userService.deleteUser(id);

    return {
      message: `Usuário de ID ${id} deletado.`,
      data: userDetails,
    };
  }
}
