import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthRequest } from '../interfaces/auth-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthRequest = context
      .switchToHttp()
      .getRequest<AuthRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException(`Erro na autenticação!`);

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);
      request.userData = payload;
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    return true;
  }

  private extractTokenFromHeader(request: AuthRequest): string | undefined {
    const [accessTokenType, token] =
      request.headers.authorization?.split(' ') ?? [];
    return accessTokenType === 'Bearer' ? token : undefined;
  }
}
