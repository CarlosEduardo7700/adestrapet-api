import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonListDto } from './dto/responses/lesson-list.dto';
import { ControllerResponseDto } from './dto/responses/controller-response.dto';
import { CreateLessonDto } from './dto/requests/create-lesson.dto';
import { LessonDetailsDto } from './dto/responses/lesson-details.dto';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  async createLesson(
    @Body() dto: CreateLessonDto,
  ): Promise<ControllerResponseDto> {
    const lessonDetails: LessonDetailsDto =
      await this.lessonService.createLesson(dto);

    return {
      message: 'Aula criada com sucesso!',
      data: lessonDetails,
    };
  }

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
