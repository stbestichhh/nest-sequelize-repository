# 🧱 Abstract Sequelize Repository for NestJS

Abstract repository pattern implementation for Sequelize ORM in NestJS projects.

Supports:

- ✅ Custom DTO typing or Sequelize creation attributes
- ✅ Custom error handling
- ✅ Soft delete support (`paranoid: true`)
- ✅ Pagination
- ✅ Optional UUID auto-generation
- ✅ Injected logger
- ✅ Simplified transaction handling

---

## 📦 Installation

```bash
npm install nest-sequelize-repository
# or
yarn add nest-sequelize-repository
```

---

## 🧠 Purpose

This package provides a reusable and extensible base repository class that works with `sequelize-typescript`. It reduces repetitive CRUD logic while keeping full flexibility for different entity needs.

---

## 🔧 Features

| Feature               | Description                                                             |
|-----------------------|-------------------------------------------------------------------------|
| ✅ Abstract class      | Extend `AbstractRepository` for each model                              |
| ✅ Generic typing      | Supports custom DTOs or defaults to Sequelize `CreationAttributes`      |
| ✅ Custom errors       | Pass custom exceptions like `ForbiddenException` or `NotFoundException` |
| ✅ Soft delete         | Supports `paranoid` models with `force` option                          |
| ✅ Pagination          | `findAllPaginated(limit, offset, where)`                                |
| ✅ Transaction utility | `repository.transaction()` for scoped logic                             |
| ✅ Logger injection    | Optional NestJS logger for better traceability                          |
| ✅ Flexible options    | Configure `includeAllByDefault`, `autoGenerateId`, etc.                 |

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

### 2. Create a DTO (optional)

```ts
export class CreateUserDto {
  name: string;
  email: string;
}
```

---

### 3. Create repository

```ts
import { AbstractRepository } from 'nest-sequelize-repository';

@Injectable()
export class UserRepository extends AbstractRepository<User, CreateUserDto> {
  constructor(@InjectModel(User) userModel: typeof User) {
    super(userModel, {
      autoGenerateId: { enable: true, field: 'user_id' },
      includeAllByDefault: true,
    });
  }
}
```

---

### 4. Use in your service

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

  async updateUser(id: string, update: Partial<CreateUserDto>) {
    return this.users.update(id, update);
  }
}
```

---

## 🧪 Testing

You can test it without NestJS using just Sequelize + Sequelize-typescript:

```ts
const repo = new AbstractRepository(UserModel);
await repo.create({ name: 'John', email: 'john@example.com' });
```

Unit tests for the abstract class can be found in the `tests/` folder.

---

## ⚙️ Options

You can pass options when instantiating:

```ts
{
  autoGenerateId: { enable: true, field: 'user_id' }, // default field is 'id'
  includeAllByDefault: true,
  logger: new Logger('MyRepo'),
}
```

---

## 📄 API Overview

### `create(dto, transaction?, customError?)`
Creates an entity. If `autoGenerateId` is enabled, generates UUID.

---

### `findByPk(id, transaction?, customError?)`
Finds entity by primary key.

---

### `findOne(where, transaction?, customError?)`
Finds entity by query.

---

### `findAll(where?, transaction?, customError?)`
Returns list of entities.

---

### `findAllPaginated(limit, offset, where?, transaction?)`
Returns paginated list and count.

---

### `update(id, partialDto, transaction?)`
Updates entity by primary key.

---

### `delete(id, force?, transaction?)`
Deletes entity by primary key. If `paranoid: true`, uses soft delete unless `force` is `true`.

---

### `transaction(fn)`
Wraps any logic inside a transaction.

```ts
await repo.transaction(async (tx) => {
  await repo.create(data, tx);
});
```

---

## 🏗️ Advanced Use

- Override methods like `create()` or `update()` to apply custom hooks or validation.
- Extend with filters, scopes, or relations as needed.

---

## 📜 License

MIT © Kiril Yakymchuk

---
