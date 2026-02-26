import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IBaseEntity } from '../interfaces/base-entity.interface';

/**
 * Classe base abstrata para delegates de deleção (Deleter)
 * Fornece operação genérica de soft delete de entidades
 *
 * @template TEntity - Tipo da entidade
 * @template TDetailsDto - Tipo do DTO de detalhes (resposta)
 */
@Injectable()
export abstract class BaseDeleter<TEntity extends IBaseEntity, TDetailsDto> {
  constructor(
    protected readonly repository: Repository<TEntity>,
    protected readonly detailsMapper: {
      createFromEntity(entity: TEntity): TDetailsDto;
    },
  ) {}

  /**
   * Deleta (soft delete) uma entidade
   * @param id - ID da entidade
   * @returns Promise com DTO de detalhes da entidade deletada
   * @throws Error se entidade não for encontrada
   */
  async delete(id: string): Promise<TDetailsDto> {
    const entity: TEntity | null = await this.repository.findOne({
      where: { id } as any,
    });

    if (!entity) {
      throw new Error(
        `${this.getEntityName()} com ID '${id}' não encontrado!`,
      );
    }

    await this.beforeDelete(entity);

    entity.deletedAt = new Date();
    const deletedEntity: TEntity = await this.repository.save(entity);

    await this.afterDelete(deletedEntity);

    return this.detailsMapper.createFromEntity(deletedEntity);
  }

  /**
   * Deleta permanentemente uma entidade (hard delete)
   * Use com cuidado!
   * @param id - ID da entidade
   */
  async hardDelete(id: string): Promise<void> {
    const entity: TEntity | null = await this.repository.findOne({
      where: { id } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    });

    if (!entity) {
      throw new Error(`${this.getEntityName()} com ID '${id}' não encontrado!`);
    }

    await this.beforeHardDelete(entity);
    await this.repository.remove(entity);
    await this.afterHardDelete();
  }

  /**
   * Método abstrato que deve retornar o nome da entidade para mensagens de erro
   * @returns Nome da entidade
   */
  protected abstract getEntityName(): string;

  /**
   * Hook que pode ser sobrescrito para validações antes de deletar (soft)
   * @param _entity - Entidade a ser deletada
   */
  protected async beforeDelete(_entity: TEntity): Promise<void> {
    // Implementação opcional nas classes filhas
  }

  /**
   * Hook que pode ser sobrescrito para ações após deletar (soft)
   * @param _entity - Entidade deletada
   */
  protected async afterDelete(_entity: TEntity): Promise<void> {
    // Implementação opcional nas classes filhas
  }

  /**
   * Hook que pode ser sobrescrito para validações antes de deletar permanentemente
   * @param _entity - Entidade a ser deletada
   */
  protected async beforeHardDelete(_entity: TEntity): Promise<void> {
    // Implementação opcional nas classes filhas
  }

  /**
   * Hook que pode ser sobrescrito para ações após deletar permanentemente
   */
  protected async afterHardDelete(): Promise<void> {
    // Implementação opcional nas classes filhas
  }
}
