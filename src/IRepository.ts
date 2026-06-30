import {
  Attributes,
  BulkCreateOptions,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindAndCountOptions,
  FindOptions,
  InstanceDestroyOptions,
  InstanceRestoreOptions,
  RestoreOptions,
  SaveOptions,
  Transaction,
  WhereOptions,
} from 'sequelize'
import { Model, ModelCtor } from 'sequelize-typescript'

export interface PaginationOptions<TModel extends Model> {
  limit?: number
  offset?: number
  page?: number
  query?: WhereOptions<Attributes<TModel>>
  findOptions?: Omit<
    FindAndCountOptions<Attributes<TModel>>,
    'where' | 'offset' | 'limit'
  >
}

export interface IRepository<TModel extends Model> {
  getModel(): ModelCtor<TModel>
  create(
    dto: CreationAttributes<TModel>,
    options?: CreateOptions<TModel>,
  ): Promise<TModel>
  insert(
    dto: CreationAttributes<TModel>,
    options?: CreateOptions<TModel>,
  ): Promise<TModel>
  insertMany(
    dtos: CreationAttributes<TModel>[],
    options?: BulkCreateOptions<Attributes<TModel>>,
  ): Promise<TModel[]>
  findByPk(
    primaryKey: string | number,
    options?: Omit<FindOptions<Attributes<TModel>>, 'where'>,
  ): Promise<TModel | null>
  findOne(
    query?: WhereOptions<Attributes<TModel>>,
    options?: Omit<FindOptions<Attributes<TModel>>, 'where'>,
  ): Promise<TModel | null>
  findAll(
    query?: WhereOptions<Attributes<TModel>>,
    options?: Omit<FindOptions<Attributes<TModel>>, 'where'>,
  ): Promise<TModel[]>
  findAllPaginated(
    options: PaginationOptions<TModel>,
  ): Promise<{ rows: TModel[]; count: number }>
  updateByPk(
    primaryKey: string | number,
    dto: Partial<Attributes<TModel>>,
    options?: SaveOptions<Attributes<TModel>>,
  ): Promise<TModel | null>
  deleteByPk(
    primaryKey: string | number,
    options?: InstanceDestroyOptions,
  ): Promise<TModel | null>
  delete(
    query?: WhereOptions<Attributes<TModel>>,
    options?: Omit<DestroyOptions<Attributes<TModel>>, 'where'>,
  ): Promise<number>
  restore(
    query?: WhereOptions<Attributes<TModel>>,
    options?: Omit<RestoreOptions<Attributes<TModel>>, 'where'>,
  ): Promise<void>
  restoreByPk(
    primaryKey: string | number,
    options?: InstanceRestoreOptions,
  ): Promise<TModel | null>
  transaction<R>(
    runInTransaction: (transaction: Transaction) => Promise<R>,
  ): Promise<R>
  calculateOffset(limit: number, page: number): number
}
