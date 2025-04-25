import { ForbiddenException, NotFoundException, Logger } from '@nestjs/common';
import { Transaction, WhereOptions, CreationAttributes } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';

/**
 * Configuration options for the abstract repository.
 */
export interface IRepositoryOptions {
  autoGenerateId?: {
    enable: boolean;
    field?: string; // Defaults to 'id' if not specified
  };
  includeAllByDefault?: boolean;
  logger?: Logger;
}

/**
 * Generic repository interface exposing basic CRUD and transaction methods.
 */
export interface IRepository<TModel extends Model, TDto> {
  create(
    dto: TDto,
    transaction?: Transaction,
    customError?: typeof ForbiddenException,
  ): Promise<TModel>;

  findByPk(
    primaryKey: string | number,
    transaction?: Transaction,
    customError?: typeof NotFoundException,
  ): Promise<TModel>;

  findOne(
    options: WhereOptions<TModel>,
    transaction?: Transaction,
    customError?: typeof NotFoundException,
  ): Promise<TModel>;

  findAll(
    options?: WhereOptions<TModel>,
    transaction?: Transaction,
    customError?: typeof NotFoundException,
  ): Promise<TModel[]>;

  findAllPaginated(
    limit: number,
    offset: number,
    options?: WhereOptions<TModel>,
    transaction?: Transaction,
  ): Promise<{ rows: TModel[]; count: number }>;

  update(
    primaryKey: string | number,
    options?: Partial<TDto>,
    transaction?: Transaction,
  ): Promise<TModel>;

  delete(
    primaryKey: string | number,
    force?: boolean,
    transaction?: Transaction,
  ): Promise<void>;

  transaction<R>(
    runInTransaction: (transaction: Transaction) => Promise<R>,
  ): Promise<R>;
}

/**
 * Base abstract class that can be extended to create model-specific repositories.
 */
export declare class AbstractRepository<
  TModel extends Model,
  TDto = CreationAttributes<TModel>,
> implements IRepository<TModel, TDto>
{
  constructor(model: ModelCtor<TModel>, options?: IRepositoryOptions);

  create(
    dto: TDto,
    transaction?: Transaction,
    customError?: typeof ForbiddenException,
  ): Promise<TModel>;

  findByPk(
    primaryKey: string | number,
    transaction?: Transaction,
    customError?: typeof NotFoundException,
  ): Promise<TModel>;

  findOne(
    options: WhereOptions<TModel>,
    transaction?: Transaction,
    customError?: typeof NotFoundException,
  ): Promise<TModel>;

  findAll(
    options?: WhereOptions<TModel>,
    transaction?: Transaction,
    customError?: typeof NotFoundException,
  ): Promise<TModel[]>;

  findAllPaginated(
    limit: number,
    offset: number,
    options?: WhereOptions<TModel>,
    transaction?: Transaction,
  ): Promise<{ rows: TModel[]; count: number }>;

  update(
    primaryKey: string | number,
    options?: Partial<TDto>,
    transaction?: Transaction,
  ): Promise<TModel>;

  delete(
    primaryKey: string | number,
    force?: boolean,
    transaction?: Transaction,
  ): Promise<void>;

  transaction<R>(
    runInTransaction: (transaction: Transaction) => Promise<R>,
  ): Promise<R>;
}
