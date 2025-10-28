import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/requests/register-user.dto';
import { UserDetailsDto } from './dto/responses/user-details.dto';
import { UserRegister } from './delegates/user-register';
import { UserListDto } from './dto/responses/user-list.dto';
import { UserReader } from './delegates/user-reader';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { UserUpdater } from './delegates/user-updater';
import { UserDeleter } from './delegates/user-deleter';

@Injectable()
export class UserService {
  constructor(
    private readonly userRegister: UserRegister,
    private readonly userReader: UserReader,
    private readonly userUpdater: UserUpdater,
    private readonly userDeleter: UserDeleter,
  ) {}

  async resgisterUser(dto: RegisterUserDto): Promise<UserDetailsDto> {
    const userDetails: UserDetailsDto =
      await this.userRegister.resgisterUser(dto);

    return userDetails;
  }

  async getUsers(page: number, limit: number): Promise<UserListDto[]> {
    const users: UserListDto[] = await this.userReader.getUsers(page, limit);
    return users;
  }

  async getUserById(id: string): Promise<UserDetailsDto> {
    const user: UserDetailsDto = await this.userReader.getUserById(id);

    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserDetailsDto> {
    const userDetails: UserDetailsDto = await this.userUpdater.updateUser(
      id,
      dto,
    );

    return userDetails;
  }

  async deleteUser(id: string): Promise<UserDetailsDto> {
    const userDetails: UserDetailsDto = await this.userDeleter.deleteUser(id);

    return userDetails;
  }
}
