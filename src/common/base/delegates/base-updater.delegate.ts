import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IBaseEntity } from '../interfaces/base-entity.interface';

/**
 * Classe base abstrata para delegates de atualização (Updater)
 * Fornece operação genérica de atualização de entidades
 *
 * @template TEntity - Tipo da entidade
 * @template TUpdateDto - Tipo do DTO de atualização
 * @template TDetailsDto - Tipo do DTO de detalhes (resposta)
 */
@Injectable()
export abstract class BaseUpdater<
  TEntity extends IBaseEntity,
  TUpdateDto,
  TDetailsDto,
> {
  constructor(
    protected readonly repository: Repository<TEntity>,
    protected readonly detailsMapper: {
      createFromEntity(entity: TEntity): TDetailsDto;
    },
  ) {}

  /**
   * Atualiza uma entidade existente
   * @param id - ID da entidade
   * @param dto - DTO com dados para atualização
   * @returns Promise com DTO de detalhes da entidade atualizada
   * @throws Error se entidade não for encontrada
   */
  async update(id: string, dto: TUpdateDto): Promise<TDetailsDto> {
    const entity: TEntity | null = await this.repository.findOne({
      where: { id } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    });

    if (!entity) {
      throw new Error(`${this.getEntityName()} com ID '${id}' não encontrado!`);
    }

    await this.beforeUpdate(entity, dto);

    const updatedData = await this.mapDtoToEntity(dto);
    Object.assign(entity, updatedData);

    const updatedEntity: TEntity = await this.repository.save(entity);

    await this.afterUpdate(updatedEntity);

    return this.detailsMapper.createFromEntity(updatedEntity);
  }

  /**
   * Método abstrato que deve mapear o DTO de atualização para objeto de entidade
   * @param dto - DTO com dados para atualização
   * @returns Promise com objeto parcial da entidade
   */
  protected abstract mapDtoToEntity(dto: TUpdateDto): Promise<Partial<TEntity>>;

  /**
   * Método abstrato que deve retornar o nome da entidade para mensagens de erro
   * @returns Nome da entidade
   */
  protected abstract getEntityName(): string;

  /**
   * Hook que pode ser sobrescrito para validações antes de atualizar
   * @param _entity - Entidade atual
   * @param _dto - DTO com novos dados
   */
  protected async beforeUpdate(
    _entity: TEntity,
    _dto: TUpdateDto,
  ): Promise<void> {
    // Implementação opcional nas classes filhas
  }

  /**
   * Hook que pode ser sobrescrito para ações após atualizar
   * @param _entity - Entidade atualizada
   */
  protected async afterUpdate(_entity: TEntity): Promise<void> {
    // Implementação opcional nas classes filhas
  }
}
