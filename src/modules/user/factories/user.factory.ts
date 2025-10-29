import bcrypt from 'node_modules/bcryptjs';
import { RegisterUserDto } from '../dto/requests/register-user.dto';
import { User } from '../user.entity';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserFactory {
  constructor(private configService: ConfigService) {}

  async createFromDto(dto: RegisterUserDto): Promise<User> {
    const user = new User();
    const saltRounds: number | undefined =
      this.configService.get<number>('SALT_ROUNDS');

    if (!saltRounds)
      throw new Error(`O salt para hashing da senha não foi fornecido!`);

    user.name = dto.name;
    user.email = dto.email;
    user.password = await bcrypt.hash(dto.password, saltRounds);
    user.streaks = 0;
    user.lastAccess = new Date();

    return user;
  }
}
