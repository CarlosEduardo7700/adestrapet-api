import { Controller, Get } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonListDto } from './dto/responses/lesson-list.dto';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get()
  async getLessons() {
    const lessons: LessonListDto[] = await this.lessonService.getLessons();
    return {
      message: `Quantidade de aulas encontradas: ${lessons.length}.`,
      data: lessons,
    };
  }
}
