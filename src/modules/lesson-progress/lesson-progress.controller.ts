import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LessonProgressService } from './lesson-progress.service';
import { ControllerResponseDto } from '../dtos/responses/controller-response.dto';
import { SaveLessonProgressDto } from './dto/requests/save-lesson-progress.dto';
import { LessonProgressDetailsDto } from './dto/responses/lesson-progress-details.dto';
import type { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { AuthGuard } from '../auth/guards/auth.guard';
import { LessonProgressListDto } from './dto/responses/lesson-progress-list.dto';

@Controller('lesson-progress')
@UseGuards(AuthGuard)
export class LessonProgressController {
  constructor(private readonly lessonProgressService: LessonProgressService) {}

  @Post()
  async saveLessonProgress(
    @Req() request: AuthRequest,
    @Body() dto: SaveLessonProgressDto,
  ): Promise<ControllerResponseDto> {
    const userId: string = request.userData.id;

    const progressDetails: LessonProgressDetailsDto =
      await this.lessonProgressService.saveLessonProgress(userId, dto);

    return {
      message: 'Progresso salvo com sucesso!',
      data: progressDetails,
    };
  }

  @Get('/mine')
  async getLessonProgressByUserId(
    @Req() request: AuthRequest,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ControllerResponseDto> {
    const userId: string = request.userData.id;

    const userProgress: LessonProgressListDto[] =
      await this.lessonProgressService.getLessonProgressByUserId(
        page,
        limit,
        userId,
      );

    return {
      message: `Progressos das aulas do usuário de ID '${userId}' encontrados.`,
      data: userProgress,
    };
  }

  @Get('/favorites')
  async getLessonProgressFavorites(
    @Req() request: AuthRequest,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ControllerResponseDto> {
    const userId: string = request.userData.id;

    const userProgress: LessonProgressListDto[] =
      await this.lessonProgressService.getLessonProgressByUserId(
        page,
        limit,
        userId,
        { isFav: true },
      );

    return {
      message: `Aulas favoritas do usuário de ID '${userId}' encontradas.`,
      data: userProgress,
    };
  }
}
