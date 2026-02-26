import { Injectable } from '@nestjs/common';
import { IBaseEntity } from './interfaces/base-entity.interface';
import { BaseCreator } from './delegates/base-creator.delegate';
import { BaseReader } from './delegates/base-reader.delegate';
import { BaseUpdater } from './delegates/base-updater.delegate';
import { BaseDeleter } from './delegates/base-deleter.delegate';

/**
 * Classe base abstrata para Services
 * Fornece operações CRUD genéricas delegando para os delegates apropriados
 * 
 * @template TEntity - Tipo da entidade
 * @template TCreateDto - Tipo do DTO de criação
 * @template TUpdateDto - Tipo do DTO de atualização
 * @template TListDto - Tipo do DTO para listagem
 * @template TDetailsDto - Tipo do DTO para detalhes
 */
@Injectable()
export abstract class BaseService<
  TEntity extends IBaseEntity,
  TCreateDto,
  TUpdateDto,
  TListDto,
  TDetailsDto,
> {
  constructor(
    protected readonly creator: BaseCreator<TEntity, TCreateDto, TDetailsDto>,
    protected readonly reader: BaseReader<TEntity, TListDto, TDetailsDto>,
    protected readonly updater: BaseUpdater<TEntity, TUpdateDto, TDetailsDto>,
    protected readonly deleter: BaseDeleter<TEntity, TDetailsDto>,
  ) {}

  /**
   * Cria uma nova entidade
   * @param dto - DTO com dados para criação
   * @returns Promise com DTO de detalhes da entidade criada
   */
  async create(dto: TCreateDto): Promise<TDetailsDto> {
    return await this.creator.create(dto);
  }

  /**
   * Busca múltiplas entidades com paginação
   * @param page - Número da página
   * @param limit - Itens por página
   * @returns Promise com array de DTOs de listagem
   */
  async getAll(page?: number, limit?: number): Promise<TListDto[]> {
    return await this.reader.getAll(page, limit);
  }

  /**
   * Busca uma entidade por ID
   * @param id - ID da entidade
   * @returns Promise com DTO de detalhes
   */
  async getById(id: string): Promise<TDetailsDto> {
    return await this.reader.getById(id);
  }

  /**
   * Atualiza uma entidade existente
   * @param id - ID da entidade
   * @param dto - DTO com dados para atualização
   * @returns Promise com DTO de detalhes da entidade atualizada
   */
  async update(id: string, dto: TUpdateDto): Promise<TDetailsDto> {
    return await this.updater.update(id, dto);
  }

  /**
   * Deleta (soft delete) uma entidade
   * @param id - ID da entidade
   * @returns Promise com DTO de detalhes da entidade deletada
   */
  async delete(id: string): Promise<TDetailsDto> {
    return await this.deleter.delete(id);
  }
}
