import { LessonDetailsDto } from '../dto/responses/lesson-details.dto';
import { Lesson } from '../lesson.entity';

export class LessonDetailsDtoMapper {
  static createFromEntity(lesson: Lesson): LessonDetailsDto {
    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      logoUrl: lesson.logoUrl,
      supportMaterialUrl: lesson.supportMaterialUrl,
      duration: lesson.duration,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      deletedAt: lesson.deletedAt,
    };
  }
}
