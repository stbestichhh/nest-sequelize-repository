import { Sequelize } from 'sequelize-typescript';
import { User } from './models/user.model';
import { UserRepository } from './user.repository';
import { AbstractRepository } from '../src/abstract.repository';

let sequelize: Sequelize;
let userRepo: UserRepository;

beforeAll(async () => {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });

  sequelize.addModels([User]);
  await sequelize.sync({ force: true });

  userRepo = new UserRepository();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Abstract Repository', () => {
  it('should throw an error when instantiated directly', () => {
    expect(() => new AbstractRepository({} as any)).toThrow(
      'AbstractRepository cannot be instantiated directly',
    );
  });
});

describe('UserRepository', () => {
  it('should create a new user', async () => {
    const user = await userRepo.create({
      name: 'Alice',
      email: 'alice@example.com',
    });
    expect(user.id).toBeDefined();
    expect(user.name).toBe('Alice');
  });

  it('should throw on create with identical unique fields', async () => {
    const dto = {
      name: 'Alice',
      email: 'alice@example.com',
      unique_field: 'a',
    };
    await userRepo.create(dto);

    await expect(userRepo.create(dto)).rejects.toThrow(
      'Entity User already exists',
    );
  });

  it('should find a user by primary key', async () => {
    const created = await userRepo.create({
      name: 'Bob',
      email: 'bob@example.com',
    });
    const found = await userRepo.findByPk(created.id);

    console.log(typeof found?.get().toJSON);
    console.log(typeof found?.get({ plain: true }).toJSON);

    expect(found).not.toBeNull();
    expect(found!.name).toBe('Bob');
  });

  it('should update a user', async () => {
    const created = await userRepo.create({
      name: 'Charlie',
      email: 'charlie@ex.com',
    });
    const updated = await userRepo.updateByPk(created.id, { name: 'Charles' });
    expect(updated).not.toBeNull();
    expect(updated!.name).toBe('Charles');
  });

  it('should delete a user', async () => {
    const user = await userRepo.create({
      name: 'Dave',
      email: 'dave@example.com',
    });
    const deletedUser = await userRepo.deleteByPk(user.id);
    expect(deletedUser).not.toBeNull();
    expect(deletedUser!.deletedAt).not.toBeNull();
  });

  it('should restore a user', async () => {
    const user = await userRepo.create({
      name: 'Dave',
      email: 'dave@example.com',
      ...{ deletedAt: new Date() },
    });

    const restoredUser = await userRepo.restoreByPk(user.id);
    expect(restoredUser).not.toBeNull();
    expect(restoredUser!.deletedAt).toBeNull();
  });

  it('should run operations inside a transaction', async () => {
    const result = await userRepo.transaction(async (tx) => {
      return await userRepo.create(
        { name: 'TxnUser', email: 'txn@x.com' },
        { transaction: tx },
      );
    });

    expect(result.id).toBeDefined();
  });
});
