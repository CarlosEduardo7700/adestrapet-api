import { RegisterUserDto } from '../dto/requests/register-user.dto';
import { User } from '../user.entity';

export class UserFactory {
  static createFromDto(dto: RegisterUserDto): User {
    const user = new User();

    user.name = dto.name;
    user.email = dto.email;
    user.password = dto.password;
    user.streaks = 0;
    user.lastAccess = new Date();

    return user;
  }
}
