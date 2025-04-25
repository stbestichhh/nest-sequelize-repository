import { Logger } from '@nestjs/common';
import {
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  Transaction,
  WhereOptions,
  ModelAttributes,
  CreationAttributes,
  ValidationError,
} from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import { v7 as uuidv7 } from 'uuid';

export interface IRepositoryOptions {
  autoGenerateId?: { enable: boolean; field?: string };
  includeAllByDefault?: boolean;
  logger?: Logger;
}

export interface IRepository<T extends Model> {
  create(
    dto: CreationAttributes<T>,
    transaction?: Transaction,
    customError?: typeof ForbiddenException,
  ): Promise<T>;
  findByPk(
    primaryKey: string | number,
    transaction?: Transaction,
    customError?: typeof NotFoundException,
  ): Promise<T>;
  findOne(
    options: WhereOptions<T>,
    transaction?: Transaction,
    customError?: typeof NotFoundException,
  ): Promise<T>;
  findAll(
    options?: WhereOptions<T>,
    transaction?: Transaction,
    customError?: typeof NotFoundException,
  ): Promise<T[]>;
  findAllPaginated(
    limit: number,
    offset: number,
    options?: WhereOptions<T>,
    transaction?: Transaction,
  ): Promise<{ rows: T[]; count: number }>;
  update(
    primaryKey: string | number,
    options?: Partial<ModelAttributes<T>>,
    transaction?: Transaction,
  ): Promise<T>;
  delete(
    primaryKey: string | number,
    force?: boolean,
    transaction?: Transaction,
  ): Promise<void>;
  transaction<R>(
    runInTransaction: (transaction: Transaction) => Promise<R>,
  ): Promise<R>;
}

export class AbstractRepository<T extends Model> implements IRepository<T> {
  constructor(model: ModelCtor<T>, options: IRepositoryOptions = {});
  public async create(
    dto: CreationAttributes<T>,
    transaction?: Transaction,
    customError: typeof ForbiddenException = ForbiddenException,
  ): Promise<T>;
  public async findByPk(
    primaryKey: string | number,
    transaction?: Transaction,
    customError: typeof NotFoundException = NotFoundException,
  ): Promise<T>;
  public async findOne(
    options: WhereOptions<T>,
    transaction?: Transaction,
    customError: typeof NotFoundException = NotFoundException,
  ): Promise<T>;
  public async findAll(
    options: WhereOptions<T>,
    transaction?: Transaction,
    customError: typeof NotFoundException = NotFoundException,
  ): Promise<T[]>;
  public async findAllPaginated(
    limit: number,
    offset: number,
    options?: WhereOptions<T>,
    transaction?: Transaction,
  ): Promise<{ rows: T[]; count: number }>;
  public async update(
    primaryKey: string | number,
    options?: Partial<ModelAttributes<T>>,
    transaction?: Transaction,
  ): Promise<T>;
  public async delete(
    primaryKey: string | number,
    force?: boolean,
    transaction?: Transaction,
  ): Promise<void>;
  public async transaction<R>(
    runInTransaction: (transaction: Transaction) => Promise<R>,
  ): Promise<R>;
}
