import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import bcrypt from 'node_modules/bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(dto: LoginDto): Promise<string> {
    const user: User | null = await this.userService.getUserByEmailForAuth(
      dto.email,
    );

    if (!user || !(await bcrypt.compare(dto.password, user.password)))
      throw new UnauthorizedException(`Email ou senha incorretos!`);

    return 'Usuário autenticado com sucesso!';
  }
}
