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

| Feature               | Description                                                        |
|-----------------------|--------------------------------------------------------------------|
| ✅ Abstract class      | Extend `AbstractRepository` for each model                         |
| ✅ Generic typing      | Supports custom DTOs or defaults to Sequelize `CreationAttributes` |
| ✅ Soft delete         | Supports `paranoid` models with `force` option                     |
| ✅ Transaction utility | `repository.transaction()` for scoped logic                        |
| ✅ Logger injection    | Optional NestJS logger for better traceability                     |
| ✅ Flexible options    | Configure `logger`, `autoGenerateId`, etc.                         |

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
    return this.users.updateByPK(id, update);
  }
}
```

---

## ⚙️ Options

You can pass options when instantiating:

```ts
{
  autoGenerateId: true, 
  idField: 'user_id', // default field is 'id'  
  logger: new MyCustomLogger('MyRepo'),
}
```

---

## Transaction usage

```ts
await repo.transaction(async (transaction) => {
  await repo.create(data, { transaction });
  await transaction.commit();
});
```

---

## 🏗️ Advanced Use

- Override methods like `create()` or `updateByPk()` to apply custom hooks or validation.
- Extend with filters, scopes, or relations as needed.

---

## 📜 License

MIT © Kiril Yakymchuk

---
