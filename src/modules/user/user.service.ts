import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/requests/register-user.dto';
import { UserDetailsDto } from './dto/responses/user-details.dto';
import { UserRegister } from './delegates/user-register';
import { UserListDto } from './dto/responses/user-list.dto';
import { UserReader } from './delegates/user-reader';

@Injectable()
export class UserService {
  constructor(
    private readonly userRegister: UserRegister,
    private readonly userReader: UserReader,
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
}
