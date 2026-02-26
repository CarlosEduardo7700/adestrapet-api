/**
 * EXEMPLO DE REFATORAÇÃO - UserService usando BaseService
 * 
 * Este arquivo demonstra como o UserService pode ser refatorado
 * para usar a classe base BaseService, reduzindo código boilerplate.
 * 
 * Compare com: src/modules/user/user.service.ts
 */

import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../common/base';
import { User } from '../../../modules/user/user.entity';
import { RegisterUserDto } from '../../../modules/user/dto/requests/register-user.dto';
import { UpdateUserDto } from '../../../modules/user/dto/requests/update-user.dto';
import { UserListDto } from '../../../modules/user/dto/responses/user-list.dto';
import { UserDetailsDto } from '../../../modules/user/dto/responses/user-details.dto';
import { UserRegisterRefactored } from './user-register.refactored.example';
import { UserReaderRefactored } from './user-reader.refactored.example';
import { UserUpdaterRefactored } from './user-updater.refactored.example';
import { UserDeleterRefactored } from './user-deleter.refactored.example';

@Injectable()
export class UserServiceRefactored extends BaseService<
  User,
  RegisterUserDto,
  UpdateUserDto,
  UserListDto,
  UserDetailsDto
> {
  constructor(
    creator: UserRegisterRefactored,
    reader: UserReaderRefactored,
    updater: UserUpdaterRefactored,
    deleter: UserDeleterRefactored,
  ) {
    super(creator, reader, updater, deleter);
  }

  /**
   * Método customizado específico do UserService
   * Usado para autenticação
   */
  async getUserByEmailForAuth(email: string): Promise<User | null> {
    return await (this.reader as UserReaderRefactored).getUserByEmailForAuth(
      email,
    );
  }

  /**
   * Nota: Métodos CRUD básicos agora são herdados da classe base!
   * 
   * Herda de BaseService:
   * - create(dto) -> equivalente ao registerUser()
   * - getAll(page, limit) -> equivalente ao getUsers()
   * - getById(id) -> equivalente ao getUserById()
   * - update(id, dto) -> equivalente ao updateUser()
   * - delete(id) -> equivalente ao deleteUser()
   * 
   * Comparação de código:
   * 
   * ANTES (user.service.ts): ~60 linhas
   * - 6 métodos CRUD manualmente delegando para os delegates
   * - Código repetitivo em cada método
   * - Manutenção difícil (mudanças precisam ser replicadas)
   * 
   * DEPOIS (refatorado): ~25 linhas
   * - Todos os métodos CRUD herdados automaticamente
   * - Apenas métodos customizados específicos do domínio
   * - Manutenção fácil (mudanças na base afetam todos os serviços)
   * 
   * REDUÇÃO: ~58% menos código!
   * 
   * Uso no Controller:
   * 
   * // Antes
   * await this.userService.resgisterUser(dto);
   * 
   * // Depois
   * await this.userService.create(dto);  // Método padronizado!
   * 
   * Vantagens:
   * ✅ Menos código boilerplate
   * ✅ Nomenclatura consistente entre módulos
   * ✅ Facilita onboarding de novos desenvolvedores
   * ✅ Manutenção centralizada
   * ✅ Type safety com TypeScript Generics
   */
}
