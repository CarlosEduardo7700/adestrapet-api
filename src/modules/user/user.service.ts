import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/requests/register-user.dto';
import { UserDetailsDto } from './dto/responses/user-details.dto';
import { UserRegister } from './delegates/user-register';

@Injectable()
export class UserService {
  constructor(private readonly userRegister: UserRegister) {}

  async resgisterUser(dto: RegisterUserDto): Promise<UserDetailsDto> {
    const userDetails: UserDetailsDto =
      await this.userRegister.resgisterUser(dto);

    return userDetails;
  }
}
