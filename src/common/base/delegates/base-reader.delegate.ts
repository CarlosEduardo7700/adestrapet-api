import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { IBaseEntity } from '../interfaces/base-entity.interface';

/**
 * Classe base abstrata para delegates de leitura (Reader)
 * Fornece operações CRUD de leitura genéricas
 * 
 * @template TEntity - Tipo da entidade
 * @template TListDto - Tipo do DTO para listagem
 * @template TDetailsDto - Tipo do DTO para detalhes
 */
@Injectable()
export abstract class BaseReader<
  TEntity extends IBaseEntity,
  TListDto,
  TDetailsDto,
> {
  constructor(
    protected readonly repository: Repository<TEntity>,
    protected readonly listMapper: { createFromEntity(entities: TEntity[]): TListDto[] },
    protected readonly detailsMapper: { createFromEntity(entity: TEntity): TDetailsDto },
  ) {}

  /**
   * Busca múltiplas entidades com paginação
   * @param page - Número da página (default: 1)
   * @param limit - Itens por página (default: 10)
   * @param additionalOptions - Opções adicionais de query do TypeORM
   * @returns Promise com array de DTOs de listagem
   */
  async getAll(
    page?: number,
    limit?: number,
    additionalOptions?: Partial<FindManyOptions<TEntity>>,
  ): Promise<TListDto[]> {
    const currentPage: number = page || 1;
    const itemsPerPage: number = limit || 10;
    const skipItems: number = (currentPage - 1) * itemsPerPage;

    const queryOptions: FindManyOptions<TEntity> = {
      take: itemsPerPage,
      skip: skipItems,
      order: {
        updatedAt: 'DESC',
      } as any,
      ...additionalOptions,
    };

    const [entities] = await this.repository.findAndCount(queryOptions);
    return this.listMapper.createFromEntity(entities);
  }

  /**
   * Busca uma entidade por ID
   * @param id - ID da entidade
   * @param relationOptions - Opções de relações do TypeORM
   * @returns Promise com DTO de detalhes
   * @throws Error se entidade não for encontrada
   */
  async getById(
    id: string,
    relationOptions?: Partial<FindManyOptions<TEntity>>,
  ): Promise<TDetailsDto> {
    const entity: TEntity | null = await this.repository.findOne({
      where: { id } as any,
      ...relationOptions,
    });

    if (!entity) {
      throw new Error(
        `${this.getEntityName()} com ID '${id}' não encontrado!`,
      );
    }

    return this.detailsMapper.createFromEntity(entity);
  }

  /**
   * Busca uma entidade raw por ID (retorna a entidade, não o DTO)
   * Útil para operações internas
   * @param id - ID da entidade
   * @param relationOptions - Opções de relações do TypeORM
   * @returns Promise com a entidade
   * @throws Error se entidade não for encontrada
   */
  async getEntityById(
    id: string,
    relationOptions?: Partial<FindManyOptions<TEntity>>,
  ): Promise<TEntity> {
    const entity: TEntity | null = await this.repository.findOne({
      where: { id } as any,
      ...relationOptions,
    });

    if (!entity) {
      throw new Error(
        `${this.getEntityName()} com ID '${id}' não encontrado!`,
      );
    }

    return entity;
  }

  /**
   * Método abstrato que deve retornar o nome da entidade para mensagens de erro
   * @returns Nome da entidade
   */
  protected abstract getEntityName(): string;
}
