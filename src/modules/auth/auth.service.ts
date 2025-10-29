import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(dto: LoginDto): Promise<User> {
    const user: User | null = await this.userService.getUserByEmail(dto.email);

    if (!user) throw new UnauthorizedException(`Email ou senha incorretos!`);

    return user;
  }
}
