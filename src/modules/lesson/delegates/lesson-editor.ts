import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lesson.entity';
import { Repository } from 'typeorm';
import { LessonDetailsDto } from '../dto/responses/lesson-details.dto';
import { EditLessonDto } from '../dto/requests/edit-lesson.dto';
import { EditLessonDtoMapper } from '../factories/edit-lesson.dto.mapper';

@Injectable()
export class LessonEditor {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async editLesson(id: string, dto: EditLessonDto): Promise<LessonDetailsDto> {
    const lesson: Lesson | null = await this.lessonRepository.findOneBy({ id });

    if (!lesson) throw new Error(`Aula de ID '${id}' não encontrada!`);

    const editedData = EditLessonDtoMapper.toEditedData(dto);

    Object.assign(lesson, editedData);

    const lessonDetails: LessonDetailsDto =
      await this.lessonRepository.save(lesson);

    return lessonDetails;
  }
}
