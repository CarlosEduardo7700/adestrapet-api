import { Injectable } from '@nestjs/common';
import { LessonReader } from './delegates/lesson-reader';
import { LessonListDto } from './dto/responses/lesson-list.dto';

@Injectable()
export class LessonService {
  constructor(private readonly lessonReader: LessonReader) {}

  async getLessons(): Promise<LessonListDto[]> {
    const lessons: LessonListDto[] = await this.lessonReader.getLessons();
    return lessons;
  }
}
