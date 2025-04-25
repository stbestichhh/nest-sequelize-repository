import { User } from './models/user.model';
import { AbstractRepository } from '../src/abstract.repository';

export class UserRepository extends AbstractRepository<User> {
  constructor() {
    super(User, {
      autoGenerateId: { enable: true },
      includeAllByDefault: true,
    });
  }
}
