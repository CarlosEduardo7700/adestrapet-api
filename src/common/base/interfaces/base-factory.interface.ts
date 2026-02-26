/**
 * Interface genérica para factories que criam entidades a partir de DTOs
 * @template TEntity - Tipo da entidade
 * @template TCreateDto - Tipo do DTO de criação
 */
export interface IBaseFactory<TEntity, TCreateDto> {
  /**
   * Cria uma nova instância de entidade a partir de um DTO
   * @param dto - DTO com dados para criar a entidade
   * @returns Promise com a nova entidade (não salva ainda)
   */
  createFromDto(dto: TCreateDto): Promise<TEntity>;
}
