import { Controller } from '@nestjs/common';
import { LessonProgressService } from './lesson-progress.service';

@Controller('lesson-progress')
export class LessonProgressController {
  constructor(private readonly lessonProgressService: LessonProgressService) {}
}
