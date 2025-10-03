import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'lesson_progress' })
export class LessonProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'is_fav', nullable: false })
  isFav: boolean;

  @Column({
    name: 'last_access',
    nullable: false,
    type: 'timestamp with time zone',
  })
  lastAccess: Date;

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
}
