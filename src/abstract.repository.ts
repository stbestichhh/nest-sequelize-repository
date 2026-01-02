import { InternalServerErrorException, Logger } from '@nestjs/common'
import {
  Transaction,
  WhereOptions,
  CreationAttributes,
  CreateOptions,
  FindOptions,
  Attributes,
  SaveOptions,
  InstanceDestroyOptions,
  InstanceRestoreOptions,
  BulkCreateOptions,
} from 'sequelize'
import { IRepository, PaginationOptions } from './IRepository'
import { Model, ModelCtor } from 'sequelize-typescript'
import { IRepositoryOptions } from './IRepositoryOptions'

export class AbstractRepository<
  TModel extends Model,
> implements IRepository<TModel> {
  protected readonly logger: Logger

  constructor(
    protected readonly model: ModelCtor<TModel>,
    options: IRepositoryOptions = {},
  ) {
    const { logger = new Logger(this.constructor.name) } = options

    if (new.target === AbstractRepository) {
      throw new Error('AbstractRepository cannot be instantiated directly')
    }

    this.logger = logger
  }

  public async create(
    dto: CreationAttributes<TModel>,
    options?: CreateOptions<Attributes<TModel>>,
  ): Promise<TModel> {
    try {
      return await this.model.create(dto, options)
    } catch (error) {
      this.logger.error(`insert: ${error}`)
      throw new InternalServerErrorException()
    }
  }

  public async insert(
    dto: CreationAttributes<TModel>,
    options?: CreateOptions<Attributes<TModel>>,
  ): Promise<TModel> {
    return this.create(dto, options)
  }

  public async insertMany(
    dtos: CreationAttributes<TModel>[],
    options?: BulkCreateOptions<Attributes<TModel>>,
  ): Promise<TModel[]> {
    try {
      return await this.model.bulkCreate(dtos, options)
    } catch (error) {
      this.logger.error(`insertMany: ${error}`)
      throw new InternalServerErrorException()
    }
  }

  public async findByPk(
    primaryKey: string | number,
    options?: Omit<FindOptions<Attributes<TModel>>, 'where'>,
  ): Promise<TModel | null> {
    try {
      return await this.model.findByPk(primaryKey, options)
    } catch (error) {
      this.logger.error(`findByPk: ${error}`)
      throw new InternalServerErrorException()
    }
  }

  public async findOne(
    query?: WhereOptions<Attributes<TModel>>,
    options?: Omit<FindOptions<Attributes<TModel>>, 'where'>,
  ): Promise<TModel | null> {
    try {
      return await this.model.findOne({
        where: query,
        ...options,
      })
    } catch (error) {
      this.logger.error(`findOne: ${error}`)
      throw new InternalServerErrorException()
    }
  }

  public async findAll(
    query?: WhereOptions<Attributes<TModel>>,
    options?: Omit<FindOptions<Attributes<TModel>>, 'where'>,
  ): Promise<TModel[]> {
    try {
      return await this.model.findAll({
        where: query,
        ...options,
      })
    } catch (error) {
      this.logger.error(`findAll: ${error}`)
      throw new InternalServerErrorException()
    }
  }

  public async findAllPaginated(
    options: PaginationOptions<TModel>,
  ): Promise<{ rows: TModel[]; count: number }> {
    try {
      let { limit = 10, offset = 0, page, query, findOptions } = options

      if (!offset && page) {
        offset = this.calculateOffset(limit, page)
      }

      return await this.model.findAndCountAll({
        where: query,
        limit,
        offset,
        ...findOptions,
      })
    } catch (error) {
      this.logger.error(`findAllPaginated: ${error}`)
      throw new InternalServerErrorException()
    }
  }

  public async updateByPk(
    primaryKey: string | number,
    dto: Partial<Attributes<TModel>>,
    options?: SaveOptions<Attributes<TModel>>,
  ): Promise<TModel | null> {
    try {
      const entity = await this.findByPk(primaryKey)

      if (!entity) {
        return null
      }

      entity.set(dto)
      return await entity.save(options)
    } catch (error) {
      this.logger.error(`updatedByPk: ${error}`)
      throw new InternalServerErrorException()
    }
  }

  public async deleteByPk(
    primaryKey: string | number,
    options?: InstanceDestroyOptions,
  ): Promise<TModel | null> {
    try {
      const entity = await this.findByPk(primaryKey, {
        paranoid: !options?.force,
      })

      if (!entity) {
        return null
      }

      if (options?.force && entity.getDataValue('deletedAt') !== undefined) {
        entity.setDataValue('deletedAt', new Date())
      }
      await entity.destroy(options)

      return entity
    } catch (error) {
      this.logger.error(`deleteByPk: ${error}`)
      throw new InternalServerErrorException()
    }
  }

  public async restoreByPk(
    primaryKey: string | number,
    options?: InstanceRestoreOptions,
  ): Promise<TModel | null> {
    try {
      const entity = await this.findByPk(primaryKey, {
        ...options,
        paranoid: false,
      })

      if (!entity) {
        return null
      }

      await entity.restore(options)

      return entity
    } catch (error) {
      this.logger.error(`restoreByPk: ${error}`)
      throw new InternalServerErrorException()
    }
  }

  public async transaction<R>(
    runInTransaction: (transaction: Transaction) => Promise<R>,
  ): Promise<R> {
    return this.model.sequelize!.transaction(async (transaction) => {
      try {
        return await runInTransaction(transaction)
      } catch (error) {
        this.logger.error(`transaction: ${error}`)
        throw new InternalServerErrorException()
      }
    })
  }

  public calculateOffset(limit: number, page: number): number {
    return limit * (page - 1)
  }
}
