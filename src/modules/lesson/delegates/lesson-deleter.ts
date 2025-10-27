import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lesson.entity';
import { Repository } from 'typeorm';
import { LessonDetailsDto } from '../dto/responses/lesson-details.dto';

@Injectable()
export class LessonDeleter {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async deleteLesson(id: string): Promise<LessonDetailsDto> {
    const lesson: Lesson | null = await this.lessonRepository.findOneBy({ id });

    if (!lesson) throw new Error(`Aula de ID '${id}' não encontrada!`);

    lesson.deletedAt = new Date();

    const lessonDetails: LessonDetailsDto =
      await this.lessonRepository.save(lesson);

    return lessonDetails;
  }
}
