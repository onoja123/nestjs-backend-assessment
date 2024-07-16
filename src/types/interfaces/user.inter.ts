import { User } from 'src/models/user.entity';

export interface CustomRequest extends Request {
  user: User;
}
