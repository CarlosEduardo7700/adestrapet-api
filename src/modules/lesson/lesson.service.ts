import { Injectable } from '@nestjs/common';
import { LessonReader } from './delegates/lesson-reader';
import { LessonListDto } from './dto/responses/lesson-list.dto';
import { CreateLessonDto } from './dto/requests/create-lesson.dto';
import { LessonCreator } from './delegates/lesson-creator';
import { LessonDetailsDto } from './dto/responses/lesson-details.dto';

@Injectable()
export class LessonService {
  constructor(
    private readonly lessonCreator: LessonCreator,
    private readonly lessonReader: LessonReader,
  ) {}

  async createLesson(dto: CreateLessonDto): Promise<LessonDetailsDto> {
    const lessonDetails: LessonDetailsDto =
      await this.lessonCreator.createLesson(dto);

    return lessonDetails;
  }

  async getLessons(page: number, limit: number): Promise<LessonListDto[]> {
    const lessons: LessonListDto[] = await this.lessonReader.getLessons(
      page,
      limit,
    );
    return lessons;
  }

  async getLessonById(id: string): Promise<LessonDetailsDto> {
    const lesson: LessonDetailsDto = await this.lessonReader.getLessonById(id);

    return lesson;
  }
}
