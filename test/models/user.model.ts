import {
  Model,
  Table,
  Column,
  PrimaryKey,
  Unique,
  AllowNull,
} from 'sequelize-typescript';

interface UserCreationAttributes {
  name: string;
  email: string;
  unique_field?: string;
}

@Table
export class User extends Model<User, UserCreationAttributes> {
  @PrimaryKey
  @Column
  id!: string;

  @Column
  name!: string;

  @Column
  email!: string;

  @Unique
  @AllowNull
  @Column
  unique_field!: string;
}
