import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from '../user.entity';
import { UserListDto } from '../dto/responses/user-list.dto';
import { UserListDtoMapper } from '../factories/user-list.dto.mapper';

@Injectable()
export class UserReader {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(page: number, limit: number): Promise<UserListDto[]> {
    const currentPage: number = page || 1;
    const itemsPerPage: number = limit || 10;

    const skipItems: number = (currentPage - 1) * itemsPerPage;

    const queryOptions: FindManyOptions<User> = {
      take: itemsPerPage,
      skip: skipItems,
      order: {
        updatedAt: 'DESC',
      },
    };

    const [users] = await this.userRepository.findAndCount(queryOptions);

    const usersList: UserListDto[] = UserListDtoMapper.createFromEntity(users);

    return usersList;
  }
}
