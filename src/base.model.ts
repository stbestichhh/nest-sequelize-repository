import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  Model,
  UpdatedAt,
} from 'sequelize-typescript'

export class BaseModel<
  TModelAttributes extends {} = any,
  TCreationAttributes extends {} = TModelAttributes,
> extends Model<TModelAttributes, TCreationAttributes> {
  @CreatedAt
  @Column
  declare createdAt: Date

  @UpdatedAt
  @Column
  declare updatedAt: Date

  @Default(null)
  @AllowNull
  @DeletedAt
  @Column({ type: DataType.DATE })
  declare deletedAt: Date | null
}
