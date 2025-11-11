import { LessonProgressDetailsDto } from '../dto/responses/lesson-progress-details.dto';
import { LessonProgress } from '../lesson-progress.entity';

export class LessonProgressDetailsDtoMapper {
  static createFromEntity(
    lessonProgress: LessonProgress,
  ): LessonProgressDetailsDto {
    return {
      userId: lessonProgress.userId,
      lessonId: lessonProgress.lessonId,
      lastAccess: lessonProgress.lastAccess,
      isFav: lessonProgress.isFav,
    };
  }
}
