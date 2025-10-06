import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLessonProgressTable1759537327250
  implements MigrationInterface
{
  name = 'CreateLessonProgressTable1759537327250';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lesson_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_fav" boolean NOT NULL, "last_access" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "userId" uuid, "lessonId" uuid, CONSTRAINT "PK_e6223ebbc5f8f5fce40e0193de1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_progress" ADD CONSTRAINT "FK_eb4349e70765bb218bb4f833f68" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_progress" ADD CONSTRAINT "FK_df13299d2740b302dd44a368df9" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson_progress" DROP CONSTRAINT "FK_df13299d2740b302dd44a368df9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_progress" DROP CONSTRAINT "FK_eb4349e70765bb218bb4f833f68"`,
    );
    await queryRunner.query(`DROP TABLE "lesson_progress"`);
  }
}
