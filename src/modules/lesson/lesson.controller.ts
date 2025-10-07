import { Controller, Get } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { Lesson } from './lesson.entity';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get()
  async getLessons() {
    const lessons: Lesson[] = await this.lessonService.getLessons();
    return {
      message: `Quantidade de aulas encontradas: ${lessons.length}.`,
      data: lessons,
    };
  }
}
