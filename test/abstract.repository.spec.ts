import { Sequelize } from 'sequelize-typescript'
import { User } from './models/user.model'
import { UserRepository } from './user.repository'
import { AbstractRepository } from '../src/abstract.repository'
import { Op } from 'sequelize'
import { InternalServerErrorException } from '@nestjs/common'

let sequelize: Sequelize
let userRepo: UserRepository

beforeAll(async () => {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  })

  sequelize.addModels([User])
  await sequelize.sync({ force: true })

  userRepo = new UserRepository()
})

afterAll(async () => {
  await sequelize.close()
})

describe('Abstract Repository', () => {
  it('should throw an error when instantiated directly', () => {
    expect(() => new AbstractRepository({} as any)).toThrow(
      'AbstractRepository cannot be instantiated directly',
    )
  })
})

describe('UserRepository', () => {
  it('should create a new user', async () => {
    const user = await userRepo.create({
      name: 'Alice',
      email: 'alice@example.com',
    })
    expect(user.id).not.toBeNull()
    expect(user.name).toBe('Alice')
  })

  it('should create a new user with alias', async () => {
    const user = await userRepo.insert({
      name: 'Alice',
      email: 'alice2@example.com',
    })
    expect(user.id).not.toBeNull()
    expect(user.email).toBe('alice2@example.com')
  })

  it('should create multiple instances', async () => {
    const users = await userRepo.insertMany([
      {
        email: '1@email.com',
        name: '1',
      },
      {
        email: '2@email.com',
        name: '2',
      },
      {
        email: '3@email.com',
        name: '3',
      },
    ])

    expect(users).toHaveLength(3)
    expect(users[1]).toHaveProperty('name', '2')
    expect(users[1].id).not.toBeNull()
  })

  it('should throw on create with identical unique fields', async () => {
    const dto = {
      name: 'Alice',
      email: 'alice@example.com',
      unique_field: 'a',
    }
    await userRepo.create(dto)

    await expect(userRepo.create(dto)).rejects.toThrow(
      InternalServerErrorException,
    )
  })

  it('should find a user by primary key', async () => {
    const created = await userRepo.create({
      name: 'Bob',
      email: 'bob@example.com',
    })
    const found = await userRepo.findByPk(created.id)

    expect(found).not.toBeNull()
    expect(found!.name).toBe('Bob')
  })

  it('should find a first user in table without query param', async () => {
    const found = await userRepo.findOne()

    expect(found).not.toBeNull()
    expect(found).toBeDefined()
  })

  it('should find all users without query param', async () => {
    const found = await userRepo.findAll()

    expect(found.length).toBeGreaterThan(0)
  })

  it('should find all users with uniqe field', async () => {
    const found = await userRepo.findAll({
      unique_field: { [Op.ne]: null },
    })

    expect(found.length).toBeGreaterThan(0)
    expect(found[0]).not.toBeNull()
    expect(found[0]).toBeDefined()
    expect(found[0].name).toBe('Alice')
  })

  it('should update a user', async () => {
    const created = await userRepo.create({
      name: 'Charlie',
      email: 'charlie@ex.com',
    })
    const updated = await userRepo.updateByPk(created.id, { name: 'Charles' })
    expect(updated).not.toBeNull()
    expect(updated!.name).toBe('Charles')
  })

  it('should delete a user', async () => {
    const user = await userRepo.create({
      name: 'Dave',
      email: 'dave@example.com',
    })
    const deletedUser = await userRepo.deleteByPk(user.id)
    expect(deletedUser).not.toBeNull()
    expect(deletedUser!.deletedAt).not.toBeNull()
  })

  it('should restore a user', async () => {
    const user = await userRepo.create({
      name: 'Dave',
      email: 'dave@example.com',
      ...{ deletedAt: new Date() },
    })

    const restoredUser = await userRepo.restoreByPk(user.id)
    expect(restoredUser).not.toBeNull()
    expect(restoredUser!.deletedAt).toBeNull()
  })

  it('should not force delete a user', async () => {
    const user = await userRepo.create({
      name: 'Dave',
      email: 'dave@example.com',
    })

    const deletedUser = await userRepo.deleteByPk(user.id)

    expect(deletedUser).not.toBeNull()
    expect(deletedUser?.deletedAt).not.toBeNull()
  })

  it('should force delete a user', async () => {
    const user = await userRepo.create({
      name: 'Dave',
      email: 'dave@example.com',
    })

    const deletedUser = await userRepo.deleteByPk(user.id, {
      force: true,
    })

    const deletedUserFound = await userRepo.findByPk(user.id, {
      paranoid: false,
    })

    expect(deletedUser).not.toBeNull()
    expect(deletedUser?.deletedAt).not.toBeNull()
    expect(deletedUserFound).toBeNull()
  })

  it('should run operations inside a transaction', async () => {
    const result = await userRepo.transaction(async (tx) => {
      return await userRepo.create(
        { name: 'TxnUser', email: 'txn@x.com' },
        { transaction: tx },
      )
    })

    expect(result.id).toBeDefined()
  })

  it('should find all with pagination', async () => {
    const allRecords = await userRepo.findAll()
    const paginated = await userRepo.findAllPaginated({
      limit: allRecords.length,
    })

    expect(paginated.rows.length).toBe(allRecords.length)
    expect(paginated.count).toBe(allRecords.length)
  })
})
