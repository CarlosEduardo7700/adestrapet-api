import { SaveLessonProgressDto } from '../dto/requests/save-lesson-progress.dto';
import { LessonProgress } from '../lesson-progress.entity';

export class LessonProgressFactory {
  static createFromDto(
    userId: string,
    dto: SaveLessonProgressDto,
  ): LessonProgress {
    const lessonProgress = new LessonProgress();

    lessonProgress.userId = userId;
    lessonProgress.lessonId = dto.lessonId;
    lessonProgress.isFav = false;
    lessonProgress.lastAccess = new Date();

    return lessonProgress;
  }
}
