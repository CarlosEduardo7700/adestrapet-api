import { CreateLessonDto } from '../dto/requests/create-lesson.dto';
import { Lesson } from '../lesson.entity';

export class LessonFactory {
  static createFromDto(dto: CreateLessonDto): Lesson {
    const lesson = new Lesson();

    lesson.title = dto.title;
    lesson.description = dto.description;
    lesson.videoUrl = dto.videoUrl;
    lesson.logoUrl = dto.logoUrl;
    lesson.supportMaterialUrl = dto.supportMaterialUrl;
    lesson.duration = dto.durationInSeconds;

    return lesson;
  }
}
