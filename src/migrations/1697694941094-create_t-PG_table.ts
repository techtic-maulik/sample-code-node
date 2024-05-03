import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTPGTable1697694941094 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 't-PG',
        columns: [
          {
            name: 'PG',
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
      `ALTER SEQUENCE "t-PG_PG_seq" RESTART WITH 3000000001 INCREMENT BY 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('t-PG', true);
  }
}
