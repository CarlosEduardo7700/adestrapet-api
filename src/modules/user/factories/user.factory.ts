import bcrypt from 'node_modules/bcryptjs';
import { RegisterUserDto } from '../dto/requests/register-user.dto';
import { User } from '../user.entity';

const SALT_ROUNDS = 10;

export class UserFactory {
  static async createFromDto(dto: RegisterUserDto): Promise<User> {
    const user = new User();

    user.name = dto.name;
    user.email = dto.email;
    user.password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    user.streaks = 0;
    user.lastAccess = new Date();

    return user;
  }
}
