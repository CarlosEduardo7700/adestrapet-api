import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/requests/login.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import bcrypt from 'node_modules/bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginResponseDto } from './dto/responses/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user: User | null = await this.userService.getUserByEmailForAuth(
      dto.email,
    );

    if (!user || !(await bcrypt.compare(dto.password, user.password)))
      throw new UnauthorizedException(`Email ou senha incorretos!`);

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
