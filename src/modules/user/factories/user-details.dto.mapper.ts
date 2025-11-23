import { Injectable } from '@nestjs/common';
import { UserDetailsDto } from '../dto/responses/user-details.dto';
import { User } from '../user.entity';

@Injectable()
export class UserDetailsDtoMapper {
  createFromEntity(user: User): UserDetailsDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      streaks: user.streaks,
      lastAccess: user.lastAccess,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }
}
