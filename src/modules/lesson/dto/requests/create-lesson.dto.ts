import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_protocol: true })
  videoUrl: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_protocol: true })
  logoUrl: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_protocol: true })
  supportMaterialUrl: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  durationInSeconds: number;
}
