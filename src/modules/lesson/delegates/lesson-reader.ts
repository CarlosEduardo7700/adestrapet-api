import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lesson.entity';
import { Repository } from 'typeorm';
import { LessonListDto } from '../dto/responses/lesson-list.dto';
import { LessonListDtoMapper } from '../factories/lesson-list.dto.mapper';
import { LessonDetailsDto } from '../dto/responses/lesson-details.dto';
import { LessonDetailsDtoMapper } from '../factories/lesson-details.dto.mapper';

@Injectable()
export class LessonReader {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async getLessons(page: number, limit: number): Promise<LessonListDto[]> {
    const currentPage: number = page || 1;
    const itemsPerPage: number = limit || 10;

    const skipItems: number = (currentPage - 1) * itemsPerPage;

    const [lessons] = await this.lessonRepository.findAndCount({
      take: itemsPerPage,
      skip: skipItems,
      order: {
        updatedAt: 'DESC',
      },
    });

    const lessonsResponse: LessonListDto[] =
      LessonListDtoMapper.createFromEntity(lessons);

    return lessonsResponse;
  }

  async getLessonById(id: string): Promise<LessonDetailsDto> {
    const lesson: Lesson | null = await this.lessonRepository.findOneBy({ id });

    if (!lesson) throw new Error(`Aula de ID '${id}' não encontrada!`);

    const lessonDetails: LessonDetailsDto =
      LessonDetailsDtoMapper.createFromEntity(lesson);

    return lessonDetails;
  }
}
