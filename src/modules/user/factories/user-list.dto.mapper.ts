import { Injectable } from '@nestjs/common';
import { UserListDto } from '../dto/responses/user-list.dto';
import { User } from '../user.entity';

@Injectable()
export class UserListDtoMapper {
  createFromEntity(users: User[]): UserListDto[] {
    return users.map((user: User) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        streaks: user.streaks,
        lastAccess: user.lastAccess,
      };
    });
  }
}
