import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonProgress } from '../lesson-progress.entity';
import { Repository } from 'typeorm';
import { LessonProgressDetailsDto } from '../dto/responses/lesson-progress-details.dto';
import { LessonProgressDetailsDtoMapper } from '../factories/lesson-progress-details.dto.mapper';

@Injectable()
export class LessonProgressDeleter {
  constructor(
    @InjectRepository(LessonProgress)
    private readonly lessonProgressRepository: Repository<LessonProgress>,
  ) {}

  async deleteLessonProgress(
    userId: string,
    lessonId: string,
  ): Promise<LessonProgressDetailsDto> {
    const progress: LessonProgress | null =
      await this.lessonProgressRepository.findOneBy({ userId, lessonId });

    if (!progress) throw new Error(`Progresso da aula não encontrada!`);

    progress.deletedAt = new Date();

    const deletedProgress: LessonProgress =
      await this.lessonProgressRepository.save(progress);

    const progressDetails: LessonProgressDetailsDto =
      LessonProgressDetailsDtoMapper.createFromEntity(deletedProgress);

    return progressDetails;
  }
}
