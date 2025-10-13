import { Controller, Get, Query } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonListDto } from './dto/responses/lesson-list.dto';
import { ControllerResponseDto } from './dto/responses/controller-response.dto';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get()
  async getLessons(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ControllerResponseDto> {
    const lessons: LessonListDto[] = await this.lessonService.getLessons(
      page,
      limit,
    );

    return {
      message: `Quantidade de aulas encontradas: ${lessons.length}.`,
      data: lessons,
    };
  }
}
