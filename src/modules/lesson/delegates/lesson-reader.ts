import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lesson.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LessonReader {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async getLessons(): Promise<Lesson[]> {
    const lessons: Lesson[] = await this.lessonRepository.find();
    return lessons;
  }
}
