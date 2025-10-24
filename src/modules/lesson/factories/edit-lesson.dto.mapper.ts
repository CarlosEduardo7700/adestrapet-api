import { EditLessonDto } from '../dto/requests/edit-lesson.dto';
import { Lesson } from '../lesson.entity';

export class EditLessonDtoMapper {
  static toEditedData(dto: EditLessonDto): Partial<Lesson> {
    const editedData: Partial<Lesson> = {};

    if (dto.title !== undefined) {
      editedData.title = dto.title;
    }

    if (dto.description !== undefined) {
      editedData.description = dto.description;
    }

    if (dto.videoUrl !== undefined) {
      editedData.videoUrl = dto.videoUrl;
    }

    if (dto.logoUrl !== undefined) {
      editedData.logoUrl = dto.logoUrl;
    }

    if (dto.supportMaterialUrl !== undefined) {
      editedData.supportMaterialUrl = dto.supportMaterialUrl;
    }

    if (dto.durationInSeconds !== undefined) {
      editedData.duration = dto.durationInSeconds;
    }

    return editedData;
  }
}
