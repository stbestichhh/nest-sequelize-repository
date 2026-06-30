import 'reflect-metadata'
import type { FactoryProvider } from '@nestjs/common'
import { SELF_DECLARED_DEPS_METADATA } from '@nestjs/common/constants'
import {
  AbstractRepository,
  InjectRepository,
  IRepository,
  Nestlize,
} from '../src/index'
import { User } from './models/user.model'
import { ModelCtor } from 'sequelize-typescript'

const getRepositoryToken = (model: ModelCtor<any>) => {
  return `NESTLIZE_REPOSITORY_${model.name}`
}

describe('repository injection helpers', () => {
  it('creates a stable repository token for a model', () => {
    expect(getRepositoryToken(User)).toBe('NESTLIZE_REPOSITORY_User')
  })

  it('applies the expected Nest injection token', () => {
    class DemoService {
      constructor(@InjectRepository(User) readonly repo: IRepository<User>) {}
    }

    const deps = Reflect.getMetadata(
      SELF_DECLARED_DEPS_METADATA,
      DemoService,
    ) as Array<{ index: number; param: unknown }>

    expect(deps).toEqual([
      {
        index: 0,
        param: getRepositoryToken(User),
      },
    ])
  })

  it('builds a provider for the given model', () => {
    const provider = Nestlize.getProvider(User) as FactoryProvider

    expect(provider.provide).toBe(getRepositoryToken(User))
    expect(typeof provider.useFactory).toBe('function')
  })

  it('creates a repository instance from the provider factory', () => {
    const provider = Nestlize.getProvider(User) as FactoryProvider
    const repository = provider.useFactory?.()

    expect(repository).toBeInstanceOf(AbstractRepository)
    expect(repository?.findAll).toBeInstanceOf(Function)
  })
})
