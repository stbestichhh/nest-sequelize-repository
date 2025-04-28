import {
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  Transaction,
  WhereOptions,
  CreationAttributes,
  ValidationError,
} from 'sequelize';
import { IRepository } from './IRepository';
import { Model, ModelCtor } from 'sequelize-typescript';
import { IRepositoryOptions } from './IRepositoryOptions';
import { v7 as uuidv7 } from 'uuid';

export class AbstractRepository<
  TModel extends Model,
  TDto = CreationAttributes<TModel>,
> implements IRepository<TModel, TDto>
{
  protected readonly logger: Logger;
  protected readonly autoGenerateId: { enable: boolean; field: string };
  protected readonly includeAllByDefault: boolean;

  constructor(
    protected readonly model: ModelCtor<TModel>,
    options: IRepositoryOptions = {},
  ) {
    if (new.target === AbstractRepository) {
      throw new Error('AbstractRepository cannot be instantiated directly');
    }

    this.logger = options.logger || new Logger(this.constructor.name);
    this.autoGenerateId = {
      enable: options.autoGenerateId?.enable ?? false,
      field: options.autoGenerateId?.field ?? 'id',
    };
    this.includeAllByDefault = options.includeAllByDefault ?? false;
  }

  public async create(
    dto: TDto,
    transaction?: Transaction,
    customError: typeof ForbiddenException = ForbiddenException,
  ): Promise<TModel> {
    const id = this.autoGenerateId.enable
      ? { [this.autoGenerateId.field]: uuidv7() }
      : {};

    try {
      return this.model.create(
        {
          ...(dto as any),
          ...id,
        },
        {
          include: this.includeAllByDefault ? { all: true } : undefined,
          transaction,
        },
      );
    } catch (e) {
      if (e instanceof ValidationError) {
        throw new customError(e);
      }
      this.logger.error(e);
      throw new InternalServerErrorException(
        'Unexpected error while creating entity',
      );
    }
  }

  public async findByPk(
    primaryKey: string | number,
    transaction?: Transaction,
    customError: typeof NotFoundException = NotFoundException,
  ): Promise<TModel> {
    const entity = await this.model.findByPk(primaryKey, {
      include: this.includeAllByDefault ? { all: true } : undefined,
      transaction,
      paranoid: true,
    });

    if (!entity) {
      throw new customError(
        `Entity of type ${this.model.name} not found by primary key: ${primaryKey}`,
      );
    }

    return entity;
  }

  public async findOne(
    options: WhereOptions<TModel>,
    transaction?: Transaction,
    customError: typeof NotFoundException = NotFoundException,
  ): Promise<TModel> {
    const entity = await this.model.findOne({
      where: options,
      include: this.includeAllByDefault ? { all: true } : undefined,
      transaction,
      paranoid: true,
    });

    if (!entity) {
      throw new customError(
        `Entity of type ${this.model.name} not found by options: ${Object.keys(options).join(', ')}`,
      );
    }

    return entity;
  }

  public async findAll(
    options: WhereOptions<TModel>,
    transaction?: Transaction,
    customError: typeof NotFoundException = NotFoundException,
  ): Promise<TModel[]> {
    const entities = await this.model.findAll({
      where: options,
      include: this.includeAllByDefault ? { all: true } : undefined,
      transaction,
      paranoid: true,
    });

    if (!entities.length) {
      throw new customError(`No entities of type ${this.model.name} found`);
    }

    return entities;
  }

  public async findAllPaginated(
    limit: number,
    offset: number,
    options?: WhereOptions<TModel>,
    transaction?: Transaction,
  ): Promise<{ rows: TModel[]; count: number }> {
    return this.model.findAndCountAll({
      where: options,
      limit,
      offset,
      include: this.includeAllByDefault ? { all: true } : undefined,
      transaction,
      paranoid: true,
    });
  }

  public async update(
    primaryKey: string | number,
    options?: Partial<TDto>,
    transaction?: Transaction,
  ): Promise<TModel> {
    const entity = await this.findByPk(primaryKey, transaction);
    return entity.set(options as any).save({ transaction });
  }

  public async delete(
    primaryKey: string | number,
    force?: boolean,
    transaction?: Transaction,
  ): Promise<void> {
    const entity = await this.findByPk(primaryKey, transaction);
    return void (await entity.destroy({ force, transaction }));
  }

  public async transaction<R>(
    runInTransaction: (transaction: Transaction) => Promise<R>,
  ): Promise<R> {
    return await this.model.sequelize!.transaction(async (transaction) => {
      try {
        return await runInTransaction(transaction);
      } catch (e) {
        this.logger.error('Transaction failed', e);
        throw e;
      }
    });
  }
}
