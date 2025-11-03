import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { LessonReader } from './delegates/lesson-reader';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { LessonCreator } from './delegates/lesson-creator';
import { LessonEditor } from './delegates/lesson-editor';
import { LessonDeleter } from './delegates/lesson-deleter';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson]), AuthModule],
  controllers: [LessonController],
  providers: [
    LessonService,
    LessonReader,
    LessonCreator,
    LessonEditor,
    LessonDeleter,
  ],
})
export class LessonModule {}
