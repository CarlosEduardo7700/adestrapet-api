import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', length: 200, nullable: false })
  name: string;

  @Column({ name: 'email', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ name: 'password', length: 100, nullable: false, select: false })
  password: string;

  @Column({ name: 'streaks', nullable: false, type: 'integer' })
  streaks: number;

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
