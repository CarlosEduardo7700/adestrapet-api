import { Injectable } from '@nestjs/common';
import { LessonReader } from './delegates/lesson-reader';
import { LessonListDto } from './dto/responses/lesson-list.dto';
import { CreateLessonDto } from './dto/requests/create-lesson.dto';
import { LessonCreator } from './delegates/lesson-creator';
import { LessonDetailsDto } from './dto/responses/lesson-details.dto';
import { EditLessonDto } from './dto/requests/edit-lesson.dto';
import { LessonEditor } from './delegates/lesson-editor';
import { LessonDeleter } from './delegates/lesson-deleter';

@Injectable()
export class LessonService {
  constructor(
    private readonly lessonCreator: LessonCreator,
    private readonly lessonReader: LessonReader,
    private readonly lessonEditor: LessonEditor,
    private readonly lessonDeleter: LessonDeleter,
  ) {}

  async createLesson(dto: CreateLessonDto): Promise<LessonDetailsDto> {
    const lessonDetails: LessonDetailsDto =
      await this.lessonCreator.createLesson(dto);

    return lessonDetails;
  }

  async getLessons(
    page: number,
    limit: number,
    titleFilter?: string,
  ): Promise<LessonListDto[]> {
    const lessons: LessonListDto[] = await this.lessonReader.getLessons(
      page,
      limit,
      titleFilter,
    );
    return lessons;
  }

  async getLessonById(id: string): Promise<LessonDetailsDto> {
    const lesson: LessonDetailsDto = await this.lessonReader.getLessonById(id);

    return lesson;
  }

  async editLesson(id: string, dto: EditLessonDto): Promise<LessonDetailsDto> {
    const lessonDetails: LessonDetailsDto = await this.lessonEditor.editLesson(
      id,
      dto,
    );

    return lessonDetails;
  }

  async deleteLesson(id: string): Promise<LessonDetailsDto> {
    const lessonDetails: LessonDetailsDto =
      await this.lessonDeleter.deleteLesson(id);

    return lessonDetails;
  }
}
