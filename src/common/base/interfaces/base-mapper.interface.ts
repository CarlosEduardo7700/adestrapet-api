/**
 * Interface genérica para mappers que convertem entidades em DTOs
 * @template TEntity - Tipo da entidade
 * @template TDto - Tipo do DTO de destino
 */
export interface IBaseMapper<TEntity, TDto> {
  /**
   * Cria um DTO a partir de uma entidade
   * @param entity - Entidade ou array de entidades
   * @returns DTO ou array de DTOs
   */
  createFromEntity(entity: TEntity): TDto;
  createFromEntity(entity: TEntity[]): TDto[];
}
