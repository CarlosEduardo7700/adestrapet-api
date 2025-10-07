import { Injectable } from '@nestjs/common';
import { Lesson } from './lesson.entity';

@Injectable()
export class LessonService {
  getLessons(): Promise<Lesson[]> {
    throw new Error();
  }
}
