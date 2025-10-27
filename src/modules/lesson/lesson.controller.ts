import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonListDto } from './dto/responses/lesson-list.dto';
import { ControllerResponseDto } from './dto/responses/controller-response.dto';
import { CreateLessonDto } from './dto/requests/create-lesson.dto';
import { LessonDetailsDto } from './dto/responses/lesson-details.dto';
import { EditLessonDto } from './dto/requests/edit-lesson.dto';

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
    @Query('title') titleFilter: string,
  ): Promise<ControllerResponseDto> {
    const lessons: LessonListDto[] = await this.lessonService.getLessons(
      page,
      limit,
      titleFilter,
    );

    return {
      message: `Quantidade de aulas encontradas: ${lessons.length}.`,
      data: lessons,
    };
  }

  @Get('/:id')
  async getLessonById(@Param('id') id: string): Promise<ControllerResponseDto> {
    const lesson: LessonDetailsDto = await this.lessonService.getLessonById(id);

    return {
      message: `Aula de ID '${id}' encontrada.`,
      data: lesson,
    };
  }

  @Patch('/:id')
  async editLesson(
    @Param('id') id: string,
    @Body() dto: EditLessonDto,
  ): Promise<ControllerResponseDto> {
    const lessonDetails: LessonDetailsDto = await this.lessonService.editLesson(
      id,
      dto,
    );

    return {
      message: `Aula de ID '${id}' atualizada.`,
      data: lessonDetails,
    };
  }

  @Delete('/:id')
  async deleteLesson(@Param('id') id: string): Promise<ControllerResponseDto> {
    const lessonDetails: LessonDetailsDto =
      await this.lessonService.deleteLesson(id);

    return {
      message: `Aula de ID ${id} deletada.`,
      data: lessonDetails,
    };
  }
}
