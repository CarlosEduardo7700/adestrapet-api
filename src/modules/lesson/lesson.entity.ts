import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LessonProgress } from '../lesson-progress/lesson-progress.entity';

@Entity({ name: 'lessons' })
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title', length: 255, nullable: false })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'video_url', length: 500, nullable: false, unique: true })
  videoUrl: string;

  @Column({ name: 'logo_url', length: 500, nullable: true })
  logoUrl: string;

  @Column({ name: 'support_material_url', length: 500, nullable: true })
  supportMaterialUrl: string;

  @Column({ name: 'duration', type: 'integer', nullable: false })
  duration: number;

  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: false,
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt: Date;

  @OneToMany(() => LessonProgress, (lessonProgress) => lessonProgress.lesson)
  lessonProgress: LessonProgress[];
}
