import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { LessonProgress } from '../lesson-progress.entity';
import { LessonProgressListDto } from '../dto/responses/lesson-progress-list.dto';
import { LessonProgressListDtoMapper } from '../factories/lesson-progress-list.dto.mapper';

@Injectable()
export class LessonProgressReader {
  constructor(
    @InjectRepository(LessonProgress)
    private readonly lessonProgressRepository: Repository<LessonProgress>,
  ) {}

  async getLessonProgressByUserId(
    page: number,
    limit: number,
    userId: string,
    extraFilters: FindOptionsWhere<LessonProgress> = {},
  ): Promise<LessonProgressListDto[]> {
    const currentPage: number = page || 1;
    const itemsPerPage: number = limit || 10;

    const skipItems: number = (currentPage - 1) * itemsPerPage;

    const queryOptions: FindManyOptions<LessonProgress> = {
      where: {
        userId: userId,
        ...extraFilters,
      },
      take: itemsPerPage,
      skip: skipItems,
      order: {
        updatedAt: 'DESC',
      },
    };

    const [userProgress] =
      await this.lessonProgressRepository.findAndCount(queryOptions);

    const progressResponse: LessonProgressListDto[] =
      LessonProgressListDtoMapper.createFromEntity(userProgress);

    return progressResponse;
  }
}
