/**
 * EXEMPLO DE REFATORAÇÃO - UserDeleter usando BaseDeleter
 * 
 * Este arquivo demonstra como o UserDeleter pode ser refatorado
 * para usar a classe base BaseDeleter, reduzindo código boilerplate.
 * 
 * Compare com: src/modules/user/delegates/user-deleter.ts
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseDeleter } from '../../../common/base';
import { User } from '../../../modules/user/user.entity';
import { UserDetailsDto } from '../../../modules/user/dto/responses/user-details.dto';
import { UserDetailsDtoMapper } from '../../../modules/user/factories/user-details.dto.mapper';

@Injectable()
export class UserDeleterRefactored extends BaseDeleter<User, UserDetailsDto> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
    detailsMapper: UserDetailsDtoMapper,
  ) {
    super(repository, detailsMapper);
  }

  protected getEntityName(): string {
    return 'Usuário';
  }

  /**
   * Hook: executado ANTES de deletar (soft delete) o usuário
   * Útil para validações e verificações de dependências
   */
  protected async beforeDelete(entity: User): Promise<void> {
    // Exemplo: verificar se usuário tem dependências
    // if (entity.lessonProgress && entity.lessonProgress.length > 0) {
    //   throw new Error('Não é possível deletar usuário com progresso de lições!');
    // }

    // Log de auditoria
    console.log(
      `Preparando para deletar usuário: ${entity.name} (ID: ${entity.id})`,
    );
  }

  /**
   * Hook: executado DEPOIS de deletar (soft delete) o usuário
   * Útil para ações pós-deleção
   */
  protected async afterDelete(entity: User): Promise<void> {
    // Exemplo: log de auditoria
    console.log(
      `Usuário deletado (soft delete): ${entity.name} (ID: ${entity.id})`,
    );

    // Aqui você poderia:
    // - Enviar notificação
    // - Arquivar dados relacionados
    // - Disparar eventos
  }

  /**
   * Hook: executado ANTES de deletar permanentemente (hard delete)
   * ATENÇÃO: Use com MUITO cuidado!
   */
  protected async beforeHardDelete(entity: User): Promise<void> {
    console.warn(
      `ATENÇÃO: Deletando permanentemente usuário: ${entity.name} (ID: ${entity.id})`,
    );

    // Validações críticas antes de deletar permanentemente
    // Exemplo: verificar permissões especiais
  }

  /**
   * Hook: executado DEPOIS de deletar permanentemente (hard delete)
   */
  protected async afterHardDelete(): Promise<void> {
    console.log('Usuário deletado permanentemente do banco de dados');

    // Limpeza de recursos relacionados
    // Exemplo: deletar arquivos, limpar cache, etc.
  }

  /**
   * Nota: O método deleteUser() agora é herdado da classe base!
   * 
   * Herda de BaseDeleter:
   * - delete(id) -> equivalente ao deleteUser() - SOFT DELETE
   * - hardDelete(id) -> deleção permanente (novo método!)
   * 
   * Fluxo de execução (soft delete):
   * 1. repository.findOne({ where: { id } }) - busca entidade
   * 2. beforeDelete(entity) - hook de validação
   * 3. entity.deletedAt = new Date() - marca como deletado
   * 4. repository.save(entity) - salva no banco
   * 5. afterDelete(entity) - hook pós-deleção
   * 6. detailsMapper.createFromEntity(entity) - mapeia para DTO
   * 7. retorna DTO
   * 
   * Fluxo de execução (hard delete):
   * 1. repository.findOne({ where: { id } }) - busca entidade
   * 2. beforeHardDelete(entity) - hook de validação crítica
   * 3. repository.remove(entity) - deleta permanentemente
   * 4. afterHardDelete() - hook pós-deleção
   * 
   * ANTES (user-deleter.ts): ~24 linhas de código
   * DEPOIS (refatorado): ~40 linhas com hooks customizados + hard delete
   * VANTAGEM: Soft delete padronizado + hard delete disponível + hooks flexíveis!
   */
}
