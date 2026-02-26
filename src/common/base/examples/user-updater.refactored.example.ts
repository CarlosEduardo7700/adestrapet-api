/**
 * EXEMPLO DE REFATORAÇÃO - UserUpdater usando BaseUpdater
 * 
 * Este arquivo demonstra como o UserUpdater pode ser refatorado
 * para usar a classe base BaseUpdater, reduzindo código boilerplate.
 * 
 * Compare com: src/modules/user/delegates/user-updater.ts
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUpdater } from '../../../common/base';
import { User } from '../../../modules/user/user.entity';
import { UpdateUserDto } from '../../../modules/user/dto/requests/update-user.dto';
import { UserDetailsDto } from '../../../modules/user/dto/responses/user-details.dto';
import { UpdateUserDtoMapper } from '../../../modules/user/factories/update-user.dto.mapper';
import { UserDetailsDtoMapper } from '../../../modules/user/factories/user-details.dto.mapper';

@Injectable()
export class UserUpdaterRefactored extends BaseUpdater<
  User,
  UpdateUserDto,
  UserDetailsDto
> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
    detailsMapper: UserDetailsDtoMapper,
    private readonly updateUserDtoMapper: UpdateUserDtoMapper,
  ) {
    super(repository, detailsMapper);
  }

  protected getEntityName(): string {
    return 'Usuário';
  }

  /**
   * Mapeia o DTO de atualização para dados da entidade
   * Este método É OBRIGATÓRIO ao estender BaseUpdater
   */
  protected async mapDtoToEntity(dto: UpdateUserDto): Promise<Partial<User>> {
    return this.updateUserDtoMapper.toUpdatedData(dto);
  }

  /**
   * Hook: executado ANTES de atualizar o usuário
   * Útil para validações customizadas
   */
  protected async beforeUpdate(
    entity: User,
    dto: UpdateUserDto,
  ): Promise<void> {
    // Exemplo: validar se email novo já existe (se estiver mudando email)
    if (dto.email && dto.email !== entity.email) {
      const existingUser = await this.repository.findOne({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new Error('Email já está em uso por outro usuário!');
      }
    }

    // Exemplo: validar regras de negócio
    if (dto.name && dto.name.length < 2) {
      throw new Error('Nome deve ter ao menos 2 caracteres!');
    }
  }

  /**
   * Hook: executado DEPOIS de atualizar o usuário
   * Útil para ações pós-atualização
   */
  protected async afterUpdate(entity: User): Promise<void> {
    // Exemplo: log de auditoria
    console.log(`Usuário atualizado: ${entity.name} (ID: ${entity.id})`);

    // Aqui você poderia:
    // - Enviar notificação de alteração
    // - Invalidar cache
    // - Disparar eventos
  }

  /**
   * Nota: O método updateUser() agora é herdado da classe base!
   * 
   * Herda de BaseUpdater:
   * - update(id, dto) -> equivalente ao updateUser()
   * 
   * Fluxo de execução:
   * 1. repository.findOne({ where: { id } }) - busca entidade
   * 2. beforeUpdate(entity, dto) - hook de validação
   * 3. mapDtoToEntity(dto) - mapeia DTO para dados da entidade
   * 4. Object.assign(entity, updatedData) - atualiza campos
   * 5. repository.save(entity) - salva no banco
   * 6. afterUpdate(entity) - hook pós-atualização
   * 7. detailsMapper.createFromEntity(entity) - mapeia para DTO
   * 8. retorna DTO
   * 
   * ANTES (user-updater.ts): ~33 linhas de código
   * DEPOIS (refatorado): ~42 linhas com hooks customizados
   * VANTAGEM: Lógica padronizada + validações robustas + hooks flexíveis!
   */
}
