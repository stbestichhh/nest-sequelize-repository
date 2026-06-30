import { ModelCtor } from 'sequelize-typescript'
import { Inject } from '@nestjs/common'
import { getRepositoryToken } from './helpers'

export const InjectRepository = (model: ModelCtor<any>) => {
  return Inject(getRepositoryToken(model))
}
