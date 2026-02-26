import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import type { IBaseEntity } from '../interfaces/base-entity.interface';
import type { IBaseFactory } from '../interfaces/base-factory.interface';

/**
 * Classe base abstrata para delegates de criação (Creator)
 * Fornece operação genérica de criação de entidades
 *
 * @template TEntity - Tipo da entidade
 * @template TCreateDto - Tipo do DTO de criação
 * @template TDetailsDto - Tipo do DTO de detalhes (resposta)
 */
@Injectable()
export abstract class BaseCreator<
  TEntity extends IBaseEntity,
  TCreateDto,
  TDetailsDto,
> {
  constructor(
    protected readonly repository: Repository<TEntity>,
    protected readonly factory: IBaseFactory<TEntity, TCreateDto>,
    protected readonly detailsMapper: {
      createFromEntity(entity: TEntity): TDetailsDto;
    },
  ) {}

  /**
   * Cria uma nova entidade
   * @param dto - DTO com dados para criação
   * @returns Promise com DTO de detalhes da entidade criada
   */
  async create(dto: TCreateDto): Promise<TDetailsDto> {
    const entity: TEntity = await this.factory.createFromDto(dto);
    const savedEntity: TEntity = await this.repository.save(entity);
    return this.detailsMapper.createFromEntity(savedEntity);
  }

  /**
   * Hook que pode ser sobrescrito para validações antes de criar
   * @param _dto - DTO com dados para criação
   */
  protected async beforeCreate(_dto: TCreateDto): Promise<void> {
    // Implementação opcional nas classes filhas
  }

  /**
   * Hook que pode ser sobrescrito para ações após criar
   * @param _entity - Entidade criada
   */
  protected async afterCreate(_entity: TEntity): Promise<void> {
    // Implementação opcional nas classes filhas
  }
}
