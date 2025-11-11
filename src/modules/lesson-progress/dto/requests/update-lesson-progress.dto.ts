import { PartialType } from '@nestjs/mapped-types';
import { SaveLessonProgressDto } from './save-lesson-progress.dto';

export class UpdateLessonProgressDto extends PartialType(
  SaveLessonProgressDto,
) {}
