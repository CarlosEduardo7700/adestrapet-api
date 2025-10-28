import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { RegisterUserDto } from '../dto/requests/register-user.dto';
import { UserDetailsDto } from '../dto/responses/user-details.dto';
import { UserFactory } from '../factories/user.factory';

@Injectable()
export class UserRegister {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async resgisterUser(dto: RegisterUserDto): Promise<UserDetailsDto> {
    const user: User = UserFactory.createFromDto(dto);

    const userDetails: UserDetailsDto = await this.userRepository.save(user);

    return userDetails;
  }
}
