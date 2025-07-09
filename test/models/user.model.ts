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

@Table({ paranoid: true })
export class User extends Model<User, UserCreationAttributes> {
  @PrimaryKey
  @Column
  declare id: string;

  @Column
  declare name: string;

  @Column
  declare email: string;

  @Unique
  @AllowNull
  @Column
  declare unique_field: string;
}
