import { Model, ModelCtor } from 'sequelize-typescript'
import { AbstractRepository } from './abstract.repository'

export class NestlizeRepository<
  TModel extends Model,
> extends AbstractRepository<TModel> {
  constructor(model: ModelCtor<TModel>) {
    super(model)
  }
}
