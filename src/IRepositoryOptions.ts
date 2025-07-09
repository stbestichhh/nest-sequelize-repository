import { Logger } from '@nestjs/common';
import { Attributes, Model } from 'sequelize';

export interface IRepositoryOptions<T extends Model> {
  autoGenerateId?: boolean;
  idField?: Extract<keyof Attributes<T>, string>;
  logger?: Logger;
}
