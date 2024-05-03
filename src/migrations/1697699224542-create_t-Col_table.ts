import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createTColTable1697699224542 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 't-Col',
        columns: [
          {
            name: 'Col',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'PG',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'Col-Name',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'Data-Type',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'DDT-Source',
            type: 'bigint[]',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.query(
      `ALTER SEQUENCE "t-Col_Col_seq" RESTART WITH 4000000001 INCREMENT BY 1`,
    );

    await queryRunner.createForeignKey(
      't-Col',
      new TableForeignKey({
        columnNames: ['PG'],
        referencedColumnNames: ['PG'],
        referencedTableName: 't-PG',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Col',
      new TableForeignKey({
        columnNames: ['Data-Type'],
        referencedColumnNames: ['Row'],
        referencedTableName: 't-Row',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('t-Col');

    const PGForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('PG') !== -1,
    );
    await queryRunner.dropForeignKey('t-Col', PGForeignKey);

    const DataTypeForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('Data-Type') !== -1,
    );
    await queryRunner.dropForeignKey('t-Col', DataTypeForeignKey);

    await queryRunner.dropTable('t-Col', true);
  }
}
