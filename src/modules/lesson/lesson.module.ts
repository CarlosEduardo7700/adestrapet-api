import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { LessonReader } from './delegates/lesson-reader';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { LessonCreator } from './delegates/lesson-creator';
import { LessonEditor } from './delegates/lesson-editor';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson])],
  controllers: [LessonController],
  providers: [LessonService, LessonReader, LessonCreator, LessonEditor],
})
export class LessonModule {}
