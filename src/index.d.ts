import { Logger } from '@nestjs/common'
import {
  Transaction,
  WhereOptions,
  CreationAttributes,
  CreateOptions,
  Attributes,
  InstanceDestroyOptions,
  InstanceRestoreOptions,
  SaveOptions,
  FindOptions,
  BulkCreateOptions,
  FindAndCountOptions,
} from 'sequelize'
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  Model,
  ModelCtor,
  UpdatedAt,
} from 'sequelize-typescript'

/**
 * Options for the find with pagination.
 *
 * @template TModel Type of the Sequelize model.
 */
export interface PaginationOptions<TModel extends Model> {
  /**
   * Sets the amount of returned records.
   */
  limit?: number

  /**
   * Amount of records to skip from the start.
   */
  offset?: number

  /**
   * A Sequelize where clause.
   */
  query?: WhereOptions<Attributes<TModel>>

  /**
   * Optional Sequelize find options, excluding 'where', 'offset' and 'limit'.
   */
  findOptions?: Omit<
    FindAndCountOptions<Attributes<TModel>>,
    'where' | 'offset' | 'limit'
  >
}

/**
 * Configuration options for the abstract repository.
 */
export interface IRepositoryOptions {
  /**
   * Optional NestJS logger instance used for internal logging.
   */
  logger?: Logger
}

/**
 * Generic interface defining basic repository operations
 * such as CRUD and transaction management.
 *
 * @template TModel Type of the Sequelize model.
 */
export interface IRepository<TModel extends Model> {
  /**
   * Creates a new record in the database.
   *
   * @param dto The data to create record with.
   * @param options Optional Sequelize create options.
   * @returns A promise resolving to the created model instance.
   */
  create(
    dto: CreationAttributes<TModel>,
    options?: CreateOptions<TModel>,
  ): Promise<TModel>

  /**
   * Creates a new record in the database. Alias for `create`
   *
   * @param dto The data to create record with.
   * @param options Optional Sequelize create options.
   * @returns A promise resolving to the created model instance.
   */
  insert(
    dto: CreationAttributes<TModel>,
    options?: CreateOptions<TModel>,
  ): Promise<TModel>

  /**
   * Creates multiple new records in the database.
   *
   * @param dtos The array of data to create records with.
   * @param options Optional Sequelize create options.
   * @returns A promise resolving to the created models instances.
   */
  insertMany(
    dtos: CreationAttributes<TModel>[],
    options?: BulkCreateOptions<Attributes<TModel>>,
  ): Promise<TModel[]>

  /**
   * Finds a record by its primary key
   *
   * @param primaryKey The value of the primary key.
   * @param options Optional Sequelize find options, excluding 'where'.
   * @returns A Promise resolving the found record or null.
   */
  findByPk(
    primaryKey: string | number,
    options?: Omit<FindOptions<Attributes<TModel>>, 'where'>,
  ): Promise<TModel | null>

  /**
   * Finds a single record by matching the provided query
   *
   * @param query A Sequelize where clause.
   * @param options Optional Sequelize find options, excluding 'where'.
   * @returns A Promise resolving the found record or null.
   */
  findOne(
    query?: WhereOptions<Attributes<TModel>>,
    options?: Omit<FindOptions<Attributes<TModel>>, 'where'>,
  ): Promise<TModel | null>

  /**
   * Finds all records matching the provided query
   *
   * @param query A Sequelize where clause.
   * @param options Optional Sequelize find options, excluding 'where'.
   * @returns A Promise resolving the found records or empty erray.
   */
  findAll(
    query?: WhereOptions<Attributes<TModel>>,
    options?: Omit<FindOptions<Attributes<TModel>>, 'where'>,
  ): Promise<TModel[]>

  /**
   * Find first amount of records set by limit and count all existing records
   *
   * @param options Pagination options.
   *
   * @returns A Promise resolving `rows`(found records) and `count`(amout of existing records).
   */
  findAllPaginated(
    options: PaginationOptions<TModel>,
  ): Promise<{ rows: TModel[]; count: number }>

  /**
   * Updates a records by its primary key.
   *
   * @param primaryKey The value of the primary key.
   * @param dto Partial data to update the record with.
   * @param options Optional Sequelize save options.
   * @returns A Promise resolving the updated record or null.
   */
  updateByPk(
    primaryKey: string | number,
    dto: Partial<Attributes<TModel>>,
    options?: SaveOptions<Attributes<TModel>>,
  ): Promise<TModel | null>

  /**
   * Deletes (soft or hard) a record by its primary key.
   *
   * @param primaryKey The value of the primary key.
   * @param options Optional Sequelize destroy options.
   * @returns A Promise resolving the deleted record or null.
   */
  deleteByPk(
    primaryKey: string | number,
    options?: InstanceDestroyOptions,
  ): Promise<TModel | null>

  /**
   * Restores a preiously soft-deleted record by its primary key.
   *
   * @param primaryKey The value of the primary key.
   * @param options Optional Sequelize restore options.
   * @returns A Promise resolving the found record or null.
   */
  restoreByPk(
    primaryKey: string | number,
    options?: InstanceRestoreOptions,
  ): Promise<TModel | null>

  /**
   * Executes a callback function withing a Sequelize transaction.
   *
   * @param runInTransaction The callback to execute, receiving the transaction object.
   * @returns A promise resolving to the result of the callback.
   */
  transaction<R>(
    runInTransaction: (transaction: Transaction) => Promise<R>,
  ): Promise<R>

  /**
   * Calculate offset for page pagination
   *
   * @param limit Amount of records to return per page
   * @param page Target page number
   * @returns Number, amount of records to skip (offset)
   */
  calculateOffset(limit: number, page: number): number
}

/**
 * Base model class based on sequelize `Model` class
 * adding timestamps.
 *
 * @template TModelAttributes Type of the Model class. Default is `any`
 * @template TCreationAttributes Type of the Model creation attributes. Default is Model class
 */
export declare class BaseModel<
  TModelAttributes extends {} = any,
  TCreationAttributes extends {} = TModelAttributes,
> extends Model<TModelAttributes, TCreationAttributes> {
  /**
   * Model creation time
   */
  createdAt: Date

  /**
   * Model update time. Default is `createdAt` timestamp
   */
  updatedAt: Date

  /**
   * Model deletion time
   *
   * @default null
   */
  deletedAt: Date | null
}

/**
 * Base abstract class providing default implementations of common
 * repository operations. Designed to be extended for model-specific logic.
 *
 * @template TModel Type of the Sequelize model.
 */
export declare class AbstractRepository<
  TModel extends Model,
> implements IRepository<TModel> {
  /**
   * Logger instance used for logging errors.
   */
  protected readonly logger: Logger

  /**
   * Constructs the abstract repository.
   *
   * @param model The Sequelize model constructor.
   * @param options Optional configuration options.
   */
  constructor(model: ModelCtor<TModel>, options?: IRepositoryOptions)

  /**
   * @inheritdoc
   */
  create(
    dto: CreationAttributes<TModel>,
    options?: CreateOptions<TModel>,
  ): Promise<TModel>

  /**
   * @inheritdoc
   */
  insert(
    dto: CreationAttributes<TModel>,
    options?: CreateOptions<TModel>,
  ): Promise<TModel>

  /**
   * @inheritdoc
   */
  insertMany(
    dtos: CreationAttributes<TModel>[],
    options?: BulkCreateOptions<Attributes<TModel>>,
  ): Promise<TModel[]>

  /**
   * @inheritdoc
   */
  findByPk(
    primaryKey: string | number,
    options?: Omit<FindOptions<Attributes<TModel>>, 'where'>,
  ): Promise<TModel | null>

  /**
   * @inheritdoc
   */
  findOne(
    query?: WhereOptions<Attributes<TModel>>,
    options?: Omit<FindOptions<Attributes<TModel>>, 'where'>,
  ): Promise<TModel | null>

  /**
   * @inheritdoc
   */
  findAll(
    query?: WhereOptions<Attributes<TModel>>,
    options?: Omit<FindOptions<Attributes<TModel>>, 'where'>,
  ): Promise<TModel[]>

  /**
   * @inheritdoc
   */
  findAllPaginated(
    options: PaginationOptions<TModel>,
  ): Promise<{ rows: TModel[]; count: number }>

  /**
   * @inheritdoc
   */
  updateByPk(
    primaryKey: string | number,
    dto: Partial<Attributes<TModel>>,
    options?: SaveOptions<Attributes<TModel>>,
  ): Promise<TModel | null>

  /**
   * @inheritdoc
   */
  deleteByPk(
    primaryKey: string | number,
    options?: InstanceDestroyOptions,
  ): Promise<TModel | null>

  /**
   * @inheritdoc
   */
  restoreByPk(
    primaryKey: string | number,
    options?: InstanceRestoreOptions,
  ): Promise<TModel | null>

  /**
   * @inheritdoc
   */
  transaction<R>(
    runInTransaction: (transaction: Transaction) => Promise<R>,
  ): Promise<R>

  /**
   * @inheritDoc
   */
  calculateOffset(limit: number, page: number): number
}
