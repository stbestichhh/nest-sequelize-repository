# 🧱 Abstract Sequelize Repository for NestJS

Abstract repository pattern implementation for Sequelize ORM in NestJS projects.

- [Quick start](#-quick-start)
- [Purpose](#-purpose)
- [Methods](#-irepository-methods)
- [Configuration](#-irepositoryoptions)

Supports:

* ✅ Custom DTO typing or Sequelize creation attributes
* ✅ Custom error handling
* ✅ Soft delete support (`paranoid: true`)
* ✅ Pagination
* ✅ Optional UUID auto-generation
* ✅ Injected logger
* ✅ Simplified transaction handling

---

## 📦 Installation

```bash
npm install nest-sequelize-repository
# or
yarn add nest-sequelize-repository
# or
pnpm add nest-sequelize-repository
```

---

## 🧠 Purpose

This package provides a reusable and extensible base repository class that works with `sequelize-typescript`. It reduces repetitive CRUD logic while keeping full flexibility for different entity needs.

---

## 🔧 Features

| Feature               | Description                                                        |
|-----------------------|--------------------------------------------------------------------|
| ✅ Abstract class      | Extend `AbstractRepository` for each model                         |
| ✅ Generic typing      | Supports custom DTOs or defaults to Sequelize `CreationAttributes` |
| ✅ Soft delete         | Supports `paranoid` models with `force` option                     |
| ✅ Transaction utility | `repository.transaction()` for scoped logic                        |
| ✅ Logger injection    | Optional NestJS logger for better traceability                     |
| ✅ Flexible options    | Configure `logger`, `autoGenerateId`, etc.                         |

---

## 🛠️ IRepositoryOptions

Configuration options for the abstract repository:

| Option           | Type                     | Default                 | Description                                           |
|------------------|--------------------------|-------------------------|-------------------------------------------------------|
| `autoGenerateId` | `boolean`                | `false`                 | Whether to auto-generate a UUIDv4 for the primary key |
| `idField`        | `string`                 | `'id'`                  | Name of the primary key field                         |
| `idGenerator`    | `() => string \| number` | `UUIDv4`                | Function for generating unique IDs                    |
| `logger`         | `Logger`                 | `NestJS default Logger` | Optional NestJS logger instance for internal logging  |

---

## 🛠️ IRepository Methods

All methods return Promises.

| Method                                               | Parameters                                                                                                 | Description                                     |            |                                        |
|------------------------------------------------------|------------------------------------------------------------------------------------------------------------|-------------------------------------------------|------------|----------------------------------------|
| `create(dto, options?)`                              | `dto: CreationAttributes<TModel>`, `options?: CreateOptions<TModel>`                                       | Creates a new record                            |            |                                        |
| `insert(dto, options?)`                              | Same as `create`                                                                                           | Alias for `create`                              |            |                                        |
| `insertMany(dtos, options?)`                         | `dtos: CreationAttributes<TModel>[]`, `options?: BulkCreateOptions<Attributes<TModel>>`                    | Creates multiple records                        |            |                                        |
| `findByPk(primaryKey, options?)`                     | `primaryKey: string \| number`, `options?: Omit<FindOptions, 'where'>`                                     | Find record by primary key                      |            |                                        |
| `findOne(query?, options?)`                          | `query?: WhereOptions`, `options?: Omit<FindOptions, 'where'>`                                             | Find single record by query                     |            |                                        |
| `findAll(query?, options?)`                          | `query?: WhereOptions`, `options?: Omit<FindOptions, 'where'>`                                             | Find all matching records                       |            |                                        |
| `findAllPaginated(limit, offset?, query?, options?)` | `limit: number`, `offset?: number`, `query?: WhereOptions`, \`options?: Omit\<FindAndCountOptions, 'where' | 'offset'                                        | 'limit'>\` | Find paginated records and total count |
| `updateByPk(primaryKey, dto, options?)`              | `primaryKey: string \| number`, `dto: Partial<Attributes<TModel>>`, `options?: SaveOptions`                | Update record by primary key                    |            |                                        |
| `deleteByPk(primaryKey, options?)`                   | `primaryKey: string \| number`, `options?: InstanceDestroyOptions`                                         | Delete (soft/hard) record by primary key        |            |                                        |
| `restoreByPk(primaryKey, options?)`                  | `primaryKey: string \| number`, `options?: InstanceRestoreOptions`                                         | Restore previously soft-deleted record          |            |                                        |
| `transaction(runInTransaction)`                      | `(transaction: Transaction) => Promise<R>`                                                                 | Execute callback within a Sequelize transaction |            |                                        |

---

## 🚀 Quick Start

### 1. Define a model

```ts
@Table({ tableName: 'users', paranoid: true })
export class User extends Model<User> {
  @PrimaryKey
  @Column
  user_id: string;

  @Column
  name: string;

  @Column
  email: string;
}
```

---

### 2. Create repository

```ts
import { AbstractRepository } from 'nest-sequelize-repository';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  constructor(@InjectModel(User) userModel: typeof User) {
    super(userModel, {
      autoGenerateId: true,
      idField: 'user_id',
    });
  }
}
```

---

### 3. Use in your service

```ts
@Injectable()
export class UserService {
  constructor(private readonly users: UserRepository) {}

  async createUser(dto: CreateUserDto) {
    return this.users.create(dto);
  }

  async getUsers() {
    return this.users.findAll();
  }

  async updateUser(id: string, update: YourUpdateType) {
    return this.users.updateByPk(id, update);
  }
}
```

---

## ⚙️ Options

You can pass options when instantiating:

```ts
{
  autoGenerateId: true,                 // optional
  idField: 'user_id',                   // optional, default field is 'id'  
  idGenerator: myGenerateIdFunc,        // optional, default is UUIDv4
  logger: new MyCustomLogger('MyRepo'), // optional
}
```

---

## 💡 Transaction usage

```ts
await repo.transaction(async (transaction) => {
  await repo.insert(data, { transaction });
  await transaction.commit();
});
```

---

## 🏗️ Advanced Use

* Override methods like `create()` or `updateByPk()` to apply custom hooks or validation.
* Extend with filters, scopes, or relations as needed.

---

## 📜 License

MIT © Kiril Yakymchuk

---
