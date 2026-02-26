/**
 * EXEMPLO DE REFATORAÇÃO - UserRegister usando BaseCreator
 * 
 * Este arquivo demonstra como o UserRegister pode ser refatorado
 * para usar a classe base BaseCreator, reduzindo código boilerplate.
 * 
 * Compare com: src/modules/user/delegates/user-register.ts
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCreator } from '../../../common/base';
import { User } from '../../../modules/user/user.entity';
import { RegisterUserDto } from '../../../modules/user/dto/requests/register-user.dto';
import { UserDetailsDto } from '../../../modules/user/dto/responses/user-details.dto';
import { UserFactory } from '../../../modules/user/factories/user.factory';
import { UserDetailsDtoMapper } from '../../../modules/user/factories/user-details.dto.mapper';

@Injectable()
export class UserRegisterRefactored extends BaseCreator<
  User,
  RegisterUserDto,
  UserDetailsDto
> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
    factory: UserFactory,
    detailsMapper: UserDetailsDtoMapper,
  ) {
    super(repository, factory, detailsMapper);
  }

  /**
   * Hook: executado ANTES de criar o usuário
   * Útil para validações customizadas
   */
  protected async beforeCreate(dto: RegisterUserDto): Promise<void> {
    // Exemplo: verificar se email já existe
    const existingUser = await this.repository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new Error('Email já cadastrado!');
    }

    // Outras validações específicas do domínio podem ser adicionadas aqui
  }

  /**
   * Hook: executado DEPOIS de criar o usuário
   * Útil para ações pós-criação (ex: enviar email, logs, etc.)
   */
  protected async afterCreate(entity: User): Promise<void> {
    // Exemplo: log de auditoria
    console.log(`Novo usuário criado: ${entity.name} (${entity.email})`);

    // Aqui você poderia:
    // - Enviar email de boas-vindas
    // - Criar registros relacionados
    // - Disparar eventos
  }

  /**
   * Nota: O método registerUser() agora é herdado da classe base!
   * 
   * Herda de BaseCreator:
   * - create(dto) -> equivalente ao registerUser()
   * 
   * Fluxo de execução:
   * 1. beforeCreate(dto) - hook de validação
   * 2. factory.createFromDto(dto) - cria entidade
   * 3. repository.save(entity) - salva no banco
   * 4. afterCreate(entity) - hook pós-criação
   * 5. detailsMapper.createFromEntity(entity) - mapeia para DTO
   * 6. retorna DTO
   * 
   * ANTES (user-register.ts): ~28 linhas de código
   * DEPOIS (refatorado): ~26 linhas + hooks customizados
   * VANTAGEM: Lógica padronizada + hooks flexíveis!
   */
}
