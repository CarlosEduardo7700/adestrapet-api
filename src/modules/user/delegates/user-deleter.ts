import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { UserDetailsDto } from '../dto/responses/user-details.dto';
import { UserDetailsDtoMapper } from '../factories/user-details.dto.mapper';

@Injectable()
export class UserDeleter {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userDetailsDtoMapper: UserDetailsDtoMapper,
  ) {}

  async deleteUser(id: string): Promise<UserDetailsDto> {
    const user: User | null = await this.userRepository.findOneBy({ id });

    if (!user) throw new Error(`Usuário de ID '${id}' não encontrado!`);

    user.deletedAt = new Date();

    const deletedUser: User = await this.userRepository.save(user);

    const userDetails: UserDetailsDto =
      this.userDetailsDtoMapper.createFromEntity(deletedUser);

    return userDetails;
  }
}
