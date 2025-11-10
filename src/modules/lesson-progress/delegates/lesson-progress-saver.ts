import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonProgressFactory } from '../factories/lesson-progress.factory';
import { LessonProgressDetailsDtoMapper } from '../factories/lesson-progress-details.dto.mapper';
import { LessonProgress } from '../lesson-progress.entity';
import { SaveLessonProgressDto } from '../dto/requests/save-lesson-progress.dto';
import { LessonProgressDetailsDto } from '../dto/responses/lesson-progress-details.dto';

@Injectable()
export class LessonProgressSaver {
  constructor(
    @InjectRepository(LessonProgress)
    private readonly lessonProgressRepository: Repository<LessonProgress>,
  ) {}

  async saveLessonProgress(
    userId: string,
    dto: SaveLessonProgressDto,
  ): Promise<LessonProgressDetailsDto> {
    let lessonProgress: LessonProgress | null =
      await this.lessonProgressRepository.findOne({
        where: {
          userId: userId,
          lessonId: dto.lessonId,
        },
      });

    if (!lessonProgress) {
      lessonProgress = LessonProgressFactory.createFromDto(userId, dto);
    } else {
      if (dto.isFav !== null) lessonProgress.isFav = dto.isFav;
      lessonProgress.lastAccess = new Date();
    }

    const savedLessonProgress: LessonProgress =
      await this.lessonProgressRepository.save(lessonProgress);

    const progressDetails: LessonProgressDetailsDto =
      LessonProgressDetailsDtoMapper.createFromEntity(savedLessonProgress);

    return progressDetails;
  }
}
