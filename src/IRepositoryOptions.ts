import { Logger } from '@nestjs/common';

export interface IRepositoryOptions {
  autoGenerateId?: boolean;
  idField?: string;
  logger?: Logger;
}
