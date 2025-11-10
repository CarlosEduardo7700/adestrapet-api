import { Injectable } from '@nestjs/common';
import { SaveLessonProgressDto } from './dto/requests/save-lesson-progress.dto';
import { LessonProgressDetailsDto } from './dto/responses/lesson-progress-details.dto';
import { LessonProgressSaver } from './delegates/lesson-progress-saver';

@Injectable()
export class LessonProgressService {
  constructor(private readonly lessonProgressSaver: LessonProgressSaver) {}

  async saveLessonProgress(
    userId: string,
    dto: SaveLessonProgressDto,
  ): Promise<LessonProgressDetailsDto> {
    const progressDetails: LessonProgressDetailsDto =
      await this.lessonProgressSaver.saveLessonProgress(userId, dto);

    return progressDetails;
  }
}
