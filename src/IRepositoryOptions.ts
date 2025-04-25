import { Logger } from '@nestjs/common';

export interface IRepositoryOptions {
  autoGenerateId?: { enable: boolean; field?: string };
  includeAllByDefault?: boolean;
  logger?: Logger;
}
