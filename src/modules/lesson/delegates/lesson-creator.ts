import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lesson.entity';
import { Repository } from 'typeorm';
import { CreateLessonDto } from '../dto/requests/create-lesson.dto';
import { LessonDetailsDto } from '../dto/responses/lesson-details.dto';
import { LessonFactory } from '../factories/lesson.factory';
import { LessonDetailsDtoMapper } from '../factories/lesson-details.dto.mapper';

@Injectable()
export class LessonCreator {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async createLesson(dto: CreateLessonDto): Promise<LessonDetailsDto> {
    const lesson: Lesson = LessonFactory.createFromDto(dto);

    const createdLesson: Lesson = await this.lessonRepository.save(lesson);

    const lessonDetails: LessonDetailsDto =
      LessonDetailsDtoMapper.createFromEntity(createdLesson);

    return lessonDetails;
  }
}
