/**
 * Interface base para entidades do TypeORM
 * Define os campos comuns que todas as entidades devem ter
 */
export interface IBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
