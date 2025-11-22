import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class SaveLessonProgressDto {
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  isFav: boolean;
}
