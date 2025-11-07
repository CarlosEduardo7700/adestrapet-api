import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLessonProgressTable1759795973785
  implements MigrationInterface
{
  name = 'CreateLessonProgressTable1759795973785';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lesson_progress" ("user_id" uuid NOT NULL, "lesson_id" uuid NOT NULL, "is_fav" boolean NOT NULL, "last_access" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_f34e3a227170e0ce674e0afb58a" PRIMARY KEY ("user_id", "lesson_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_progress" ADD CONSTRAINT "FK_0d9292b3eb40707950eeeba9617" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_progress" ADD CONSTRAINT "FK_980e74721039ebe210fee2eeca2" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson_progress" DROP CONSTRAINT "FK_980e74721039ebe210fee2eeca2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_progress" DROP CONSTRAINT "FK_0d9292b3eb40707950eeeba9617"`,
    );
    await queryRunner.query(`DROP TABLE "lesson_progress"`);
  }
}
