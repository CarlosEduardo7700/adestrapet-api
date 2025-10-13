import { LessonListDto } from '../dto/responses/lesson-list.dto';
import { Lesson } from '../lesson.entity';

export class LessonListDtoMapper {
  static createFromEntity(lessons: Lesson[]): LessonListDto[] {
    return lessons.map((lesson: Lesson) => {
      return {
        id: lesson.id,
        title: lesson.title,
        logoUrl: lesson.logoUrl,
        duration: lesson.duration,
        createdAt: lesson.createdAt,
      };
    });
  }
}
