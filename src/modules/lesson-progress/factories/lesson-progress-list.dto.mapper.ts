import { LessonProgressListDto } from '../dto/responses/lesson-progress-list.dto';
import { LessonProgress } from '../lesson-progress.entity';

export class LessonProgressListDtoMapper {
  static createFromEntity(progress: LessonProgress[]): LessonProgressListDto[] {
    return progress.map((progress: LessonProgress) => {
      const lessonProgressListDto = {
        userId: progress.userId,
        lessonId: progress.lessonId,
        isFav: progress.isFav,
        lastAccess: progress.lastAccess,
        lesson: {
          id: progress.lesson.id,
          title: progress.lesson.title,
          logoUrl: progress.lesson.logoUrl,
          duration: progress.lesson.duration,
        },
      };

      return lessonProgressListDto;
    });
  }
}
