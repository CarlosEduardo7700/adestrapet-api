import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/requests/update-user.dto';
import { User } from '../user.entity';

@Injectable()
export class UpdateUserDtoMapper {
  toUpdatedData(dto: UpdateUserDto): Partial<User> {
    const updatedData: Partial<User> = {};

    if (dto.name !== undefined) {
      updatedData.name = dto.name;
    }

    if (dto.email !== undefined) {
      updatedData.email = dto.email;
    }

    if (dto.password !== undefined) {
      updatedData.password = dto.password;
    }

    return updatedData;
  }
}
