import { ModelCtor } from 'sequelize-typescript'
import { Provider } from '@nestjs/common'
import { getRepositoryToken } from './helpers'
import { NestlizeRepository } from './nestlize.repository'

export class Nestlize {
  public static getProvider(model: ModelCtor<any>): Provider {
    return {
      provide: getRepositoryToken(model),
      useFactory: () => new NestlizeRepository(model),
    }
  }
}
