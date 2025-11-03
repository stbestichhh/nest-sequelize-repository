import {
  Attributes,
  BulkCreateOptions,
  CreateOptions,
  CreationAttributes,
  FindAndCountOptions,
  FindOptions,
  InstanceDestroyOptions,
  InstanceRestoreOptions,
  SaveOptions,
  Transaction,
  WhereOptions,
} from 'sequelize'
import { Model } from 'sequelize-typescript'

export interface PaginationOptions<TModel extends Model> {
  limit?: number
  offset?: number
  query?: WhereOptions<Attributes<TModel>>
  findOptions?: Omit<
    FindAndCountOptions<Attributes<TModel>>,
    'where' | 'offset' | 'limit'
  >
}

export interface IRepository<TModel extends Model> {
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
  restoreByPk(
    primaryKey: string | number,
    options?: InstanceRestoreOptions,
  ): Promise<TModel | null>
  transaction<R>(
    runInTransaction: (transaction: Transaction) => Promise<R>,
  ): Promise<R>
}
