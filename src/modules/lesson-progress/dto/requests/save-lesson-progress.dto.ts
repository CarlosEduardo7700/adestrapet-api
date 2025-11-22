import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class SaveLessonProgressDto {
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @IsBoolean()
  @IsNotEmpty()
  isFav: boolean;
}
