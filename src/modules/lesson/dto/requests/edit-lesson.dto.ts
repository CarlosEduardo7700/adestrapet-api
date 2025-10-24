import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonDto } from './create-lesson.dto';

export class EditLessonDto extends PartialType(CreateLessonDto) {}
