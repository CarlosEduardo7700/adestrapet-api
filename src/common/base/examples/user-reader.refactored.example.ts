/**
 * EXEMPLO DE REFATORAÇÃO - UserReader usando BaseReader
 * 
 * Este arquivo demonstra como o UserReader pode ser refatorado
 * para usar a classe base BaseReader, reduzindo código boilerplate.
 * 
 * Compare com: src/modules/user/delegates/user-reader.ts
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseReader } from '../../../common/base';
import { User } from '../user.entity';
import { UserListDto } from '../dto/responses/user-list.dto';
import { UserDetailsDto } from '../dto/responses/user-details.dto';
import { UserListDtoMapper } from '../factories/user-list.dto.mapper';
import { UserDetailsDtoMapper } from '../factories/user-details.dto.mapper';

@Injectable()
export class UserReaderRefactored extends BaseReader<
  User,
  UserListDto,
  UserDetailsDto
> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
    listMapper: UserListDtoMapper,
    detailsMapper: UserDetailsDtoMapper,
  ) {
    super(repository, listMapper, detailsMapper);
  }

  protected getEntityName(): string {
    return 'Usuário';
  }

  /**
   * Método customizado específico do UserReader
   * Busca usuário por email para autenticação (inclui password)
   */
  async getUserByEmailForAuth(email: string): Promise<User | null> {
    const user: User | null = await this.repository.findOne({
      where: { email },
      select: ['id', 'password', 'email'],
    });
    return user;
  }

  /**
   * Nota: Os métodos getUsers() e getUserById() agora são herdados da classe base!
   * 
   * Herda de BaseReader:
   * - getAll(page, limit) -> equivalente ao getUsers()
   * - getById(id) -> equivalente ao getUserById()
   * - getEntityById(id) -> busca entidade sem mapear para DTO
   * 
   * ANTES (user-reader.ts): ~60 linhas de código
   * DEPOIS (refatorado): ~35 linhas de código
   * REDUÇÃO: ~42% menos código!
   */
}
