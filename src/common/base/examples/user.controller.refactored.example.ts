/**
 * EXEMPLO DE REFATORAÇÃO - UserController usando BaseController
 * 
 * Este arquivo demonstra como o UserController pode ser refatorado
 * para usar a classe base BaseController, reduzindo código boilerplate.
 * 
 * Compare com: src/modules/user/user.controller.ts
 */

import {
  Controller,
  Get,
  Req,
  UseGuards,
  Body,
  Post,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { BaseController } from '../../../common/base';
import { User } from '../../../modules/user/user.entity';
import { RegisterUserDto } from '../../../modules/user/dto/requests/register-user.dto';
import { UpdateUserDto } from '../../../modules/user/dto/requests/update-user.dto';
import { UserListDto } from '../../../modules/user/dto/responses/user-list.dto';
import { UserDetailsDto } from '../../../modules/user/dto/responses/user-details.dto';
import { UserServiceRefactored } from './user.service.refactored.example';
import { AuthGuard } from '../../../modules/auth/guards/auth.guard';
import { AuthRequest } from '../../../modules/auth/interfaces/auth-request.interface';
import { ControllerResponseDto } from '../../../modules/dtos/responses/controller-response.dto';

@Controller('user')
export class UserControllerRefactored extends BaseController<
  User,
  RegisterUserDto,
  UpdateUserDto,
  UserListDto,
  UserDetailsDto
> {
  constructor(service: UserServiceRefactored) {
    super(service);
  }

  protected getEntityName(): string {
    return 'Usuário';
  }

  /**
   * Sobrescreve mensagem de criação (opcional)
   * Se não sobrescrever, usa a mensagem padrão da classe base
   */
  protected getCreateSuccessMessage(): string {
    return 'Usuário cadastrado com sucesso!';
  }

  /**
   * Endpoint customizado específico do UserController
   * Busca detalhes do usuário autenticado (não precisa passar ID na URL)
   */
  @Get('/details')
  @UseGuards(AuthGuard)
  async getUserDetails(
    @Req() request: AuthRequest,
  ): Promise<ControllerResponseDto> {
    const id = request.userData.id;
    const user = await this.service.getById(id);
    return {
      message: `Usuário de ID '${id}' encontrado.`,
      data: user,
    };
  }

  /**
   * Sobrescreve o método update para usar ID do token JWT
   * ao invés de receber ID como parâmetro
   */
  @Patch()
  @UseGuards(AuthGuard)
  async updateAuthenticatedUser(
    @Req() request: AuthRequest,
    @Body() dto: UpdateUserDto,
  ): Promise<ControllerResponseDto> {
    const id = request.userData.id;
    const userDetails = await this.service.update(id, dto);
    return {
      message: `Usuário de ID '${id}' atualizado.`,
      data: userDetails,
    };
  }

  /**
   * Sobrescreve o método delete para usar ID do token JWT
   * ao invés de receber ID como parâmetro
   */
  @Delete()
  @UseGuards(AuthGuard)
  async deleteAuthenticatedUser(
    @Req() request: AuthRequest,
  ): Promise<ControllerResponseDto> {
    const id = request.userData.id;
    const userDetails = await this.service.delete(id);
    return {
      message: `Usuário de ID ${id} deletado.`,
      data: userDetails,
    };
  }

  /**
   * Nota: Endpoints CRUD básicos agora são herdados da classe base!
   * 
   * Herda de BaseController (todos com @UseGuards(AuthGuard)):
   * 
   * @Post() create(@Body() dto)
   * - POST /user
   * - Cria novo usuário
   * 
   * @Get() getAll(@Query('page') page, @Query('limit') limit)
   * - GET /user?page=1&limit=10
   * - Lista usuários com paginação
   * 
   * @Get(':id') getById(@Param('id') id)
   * - GET /user/:id
   * - Busca usuário por ID
   * 
   * @Patch(':id') update(@Param('id') id, @Body() dto)
   * - PATCH /user/:id
   * - Atualiza usuário
   * 
   * @Delete(':id') delete(@Param('id') id)
   * - DELETE /user/:id
   * - Deleta usuário (soft delete)
   * 
   * Comparação de código:
   * 
   * ANTES (user.controller.ts): ~78 linhas
   * - 5 endpoints manualmente implementados
   * - Decorators repetitivos
   * - Formatação de resposta manual em cada endpoint
   * - Mensagens de sucesso em cada método
   * 
   * DEPOIS (refatorado): ~65 linhas
   * - Endpoints básicos herdados automaticamente
   * - Apenas endpoints customizados implementados
   * - Resposta padronizada pela classe base
   * - Mensagens customizáveis através de métodos protected
   * 
   * VANTAGEM: ~17% menos código + consistência entre módulos!
   * 
   * Flexibilidade:
   * ✅ Pode sobrescrever qualquer endpoint base se necessário
   * ✅ Pode adicionar endpoints customizados livremente
   * ✅ Pode customizar mensagens de sucesso
   * ✅ Guards podem ser customizados por endpoint
   * ✅ Mantém type safety completo
   * 
   * Exemplo de uso da API:
   * 
   * POST   /user              -> create() [herdado]
   * GET    /user?page=1       -> getAll() [herdado]
   * GET    /user/:id          -> getById() [herdado]
   * GET    /user/details      -> getUserDetails() [customizado]
   * PATCH  /user              -> updateAuthenticatedUser() [sobrescrito]
   * DELETE /user              -> deleteAuthenticatedUser() [sobrescrito]
   */
}

/**
 * ALTERNATIVA SIMPLIFICADA
 * Se você não precisa customizar nada, o controller pode ser ainda mais simples:
 */

/*
@Controller('user')
export class UserControllerSimple extends BaseController<
  User,
  RegisterUserDto,
  UpdateUserDto,
  UserListDto,
  UserDetailsDto
> {
  constructor(service: UserService) {
    super(service);
  }

  protected getEntityName(): string {
    return 'Usuário';
  }

  // Pronto! Todos os endpoints CRUD já estão disponíveis!
  // Apenas ~10 linhas de código!
}
*/
