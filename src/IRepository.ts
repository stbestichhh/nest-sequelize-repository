import { Model } from 'sequelize-typescript';
import {
  CreationAttributes,
  ModelAttributes,
  Transaction,
  WhereOptions,
} from 'sequelize';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

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
