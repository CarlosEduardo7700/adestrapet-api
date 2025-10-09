import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lesson.entity';
import { Repository } from 'typeorm';
import { LessonListDto } from '../dto/responses/lesson-list.dto';

@Injectable()
export class LessonReader {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async getLessons(): Promise<LessonListDto[]> {
    const lessons: Lesson[] = await this.lessonRepository.find();

    const lessonsResponse: LessonListDto[] = lessons.map((lesson) => {
      return {
        id: lesson.id,
        title: lesson.title,
        logoUrl: lesson.logoUrl,
        duration: lesson.duration,
        createdAt: lesson.createdAt,
      };
    });

    return lessonsResponse;
  }
}
