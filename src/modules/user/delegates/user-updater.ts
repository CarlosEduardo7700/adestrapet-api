import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { UpdateUserDto } from '../dto/requests/update-user.dto';
import { UserDetailsDto } from '../dto/responses/user-details.dto';
import { UpdateUserDtoMapper } from '../factories/update-user.dto.mapper';
import { UserDetailsDtoMapper } from '../factories/user-details.dto.mapper';

@Injectable()
export class UserUpdater {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly updateUserDtoMapper: UpdateUserDtoMapper,
    private readonly userDetailsDtoMapper: UserDetailsDtoMapper,
  ) {}

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserDetailsDto> {
    const user: User | null = await this.userRepository.findOneBy({ id });

    if (!user) throw new Error(`Usuário de ID '${id}' não encontrado!`);

    const updatedData = this.updateUserDtoMapper.toUpdatedData(dto);

    Object.assign(user, updatedData);

    const updatedUser: User = await this.userRepository.save(user);

    const userDetails: UserDetailsDto =
      this.userDetailsDtoMapper.createFromEntity(updatedUser);

    return userDetails;
  }
}
