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

  it('should find a user by primary key', async () => {
    const created = await userRepo.create({
      name: 'Bob',
      email: 'bob@example.com',
    });
    const found = await userRepo.findByPk(created.id);
    expect(found.name).toBe('Bob');
  });

  it('should update a user', async () => {
    const created = await userRepo.create({
      name: 'Charlie',
      email: 'charlie@ex.com',
    });
    const updated = await userRepo.update(created.id, { name: 'Charles' });
    expect(updated.name).toBe('Charles');
  });

  it('should delete a user', async () => {
    const user = await userRepo.create({
      name: 'Dave',
      email: 'dave@example.com',
    });
    await userRepo.delete(user.id);
    await expect(userRepo.findByPk(user.id)).rejects.toThrow(
      `Entity of type User not found by primary key: ${user.id}`,
    );
  });

  it('should paginate results', async () => {
    await userRepo.create({ name: 'User1', email: 'u1@x.com' });
    await userRepo.create({ name: 'User2', email: 'u2@x.com' });
    const { rows, count } = await userRepo.findAllPaginated(1, 0);
    expect(rows.length).toBe(1);
    expect(count).toBeGreaterThanOrEqual(2);
  });

  it('should run operations inside a transaction', async () => {
    const result = await userRepo.transaction(async (tx) => {
      return await userRepo.create({ name: 'TxnUser', email: 'txn@x.com' }, tx);
    });

    expect(result.id).toBeDefined();
  });
});
