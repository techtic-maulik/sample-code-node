import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTShareTable1697694941096 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 't-Share',
        columns: [
          {
            name: 'Share',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
        ],
      }),
      true,
    );

    await queryRunner.query(
      `ALTER SEQUENCE "t-Share_Share_seq" RESTART WITH 2000000001 INCREMENT BY 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('t-Share', true);
  }
}
