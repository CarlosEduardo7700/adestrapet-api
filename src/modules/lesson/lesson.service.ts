import { Injectable } from '@nestjs/common';
import { Lesson } from './lesson.entity';
import { LessonReader } from './delegates/lesson-reader';

@Injectable()
export class LessonService {
  constructor(private readonly lessonReader: LessonReader) {}

  async getLessons(): Promise<Lesson[]> {
    const lessons = await this.lessonReader.getLessons();
    return lessons;
  }
}
