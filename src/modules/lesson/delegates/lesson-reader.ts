import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lesson.entity';
import { Repository } from 'typeorm';
import { LessonListDto } from '../dto/responses/lesson-list.dto';
import { LessonListDtoMapper } from '../factories/lesson-list.dto.mapper';

@Injectable()
export class LessonReader {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async getLessons(): Promise<LessonListDto[]> {
    const lessons: Lesson[] = await this.lessonRepository.find();

    const lessonsResponse: LessonListDto[] =
      LessonListDtoMapper.createFromEntity(lessons);

    return lessonsResponse;
  }
}
