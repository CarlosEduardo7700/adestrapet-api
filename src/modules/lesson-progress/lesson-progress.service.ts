import { Injectable } from '@nestjs/common';
import { SaveLessonProgressDto } from './dto/requests/save-lesson-progress.dto';
import { LessonProgressDetailsDto } from './dto/responses/lesson-progress-details.dto';
import { LessonProgressSaver } from './delegates/lesson-progress-saver';
import { LessonProgressReader } from './delegates/lesson-progress-reader';
import { LessonProgressListDto } from './dto/responses/lesson-progress-list.dto';
import { LessonProgress } from './lesson-progress.entity';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class LessonProgressService {
  constructor(
    private readonly lessonProgressSaver: LessonProgressSaver,
    private readonly lessonProgressReader: LessonProgressReader,
  ) {}

  async saveLessonProgress(
    userId: string,
    dto: SaveLessonProgressDto,
  ): Promise<LessonProgressDetailsDto> {
    const progressDetails: LessonProgressDetailsDto =
      await this.lessonProgressSaver.saveLessonProgress(userId, dto);

    return progressDetails;
  }

  async getLessonProgressByUserId(
    page: number,
    limit: number,
    userId: string,
    extraFilters?: FindOptionsWhere<LessonProgress>,
  ): Promise<LessonProgressListDto[]> {
    const userProgress: LessonProgressListDto[] =
      await this.lessonProgressReader.getLessonProgressByUserId(
        page,
        limit,
        userId,
        extraFilters,
      );

    return userProgress;
  }
}
