import { Module } from '@nestjs/common';
import { LessonProgressService } from './lesson-progress.service';
import { LessonProgressController } from './lesson-progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonProgress } from './lesson-progress.entity';
import { AuthModule } from '../auth/auth.module';
import { LessonProgressSaver } from './delegates/lesson-progress-saver';

@Module({
  imports: [TypeOrmModule.forFeature([LessonProgress]), AuthModule],
  controllers: [LessonProgressController],
  providers: [LessonProgressService, LessonProgressSaver],
})
export class LessonProgressModule {}
