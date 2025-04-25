import { Model, Table, Column, PrimaryKey } from 'sequelize-typescript';

interface UserCreationAttributes {
  name: string;
  email: string;
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
}
