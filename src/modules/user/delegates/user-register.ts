import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { RegisterUserDto } from '../dto/requests/register-user.dto';
import { UserDetailsDto } from '../dto/responses/user-details.dto';
import { UserFactory } from '../factories/user.factory';
import { UserDetailsDtoMapper } from '../factories/user-details.dto.mapper';

@Injectable()
export class UserRegister {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userFactory: UserFactory,
  ) {}

  async resgisterUser(dto: RegisterUserDto): Promise<UserDetailsDto> {
    const user: User = await this.userFactory.createFromDto(dto);

    const registeredUser: User = await this.userRepository.save(user);

    const userDetails: UserDetailsDto =
      UserDetailsDtoMapper.createFromEntity(registeredUser);

    return userDetails;
  }
}
