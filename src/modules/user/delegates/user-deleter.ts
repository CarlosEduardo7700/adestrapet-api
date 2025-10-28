import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { UserDetailsDto } from '../dto/responses/user-details.dto';

@Injectable()
export class UserDeleter {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async deleteUser(id: string): Promise<UserDetailsDto> {
    const user: User | null = await this.userRepository.findOneBy({ id });

    if (!user) throw new Error(`Usuário de ID '${id}' não encontrado!`);

    user.deletedAt = new Date();

    const userDetails: UserDetailsDto = await this.userRepository.save(user);

    return userDetails;
  }
}
