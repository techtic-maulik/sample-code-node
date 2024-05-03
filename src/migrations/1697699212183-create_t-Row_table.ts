import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createTRowTable1697699212183 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 't-Row',
        columns: [
          {
            name: 'Row',
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
            name: 'RowID',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'Share',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'Inherit',
            type: 'bigint[]',
            isNullable: true,
          },
          {
            name: 'Row-Type',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'Row-Level',
            type: 'integer',
            default: 1,
            isNullable: false,
          },
          {
            name: 'Parent-Row',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'Sibling-Row',
            type: 'bigint',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.query(
      `ALTER SEQUENCE "t-Row_Row_seq" RESTART WITH 1000000001 INCREMENT BY 1`,
    );

    await queryRunner.createForeignKey(
      't-Row',
      new TableForeignKey({
        columnNames: ['PG'],
        referencedColumnNames: ['PG'],
        referencedTableName: 't-PG',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Row',
      new TableForeignKey({
        columnNames: ['Share'],
        referencedColumnNames: ['Share'],
        referencedTableName: 't-Share',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Row',
      new TableForeignKey({
        columnNames: ['Parent-Row'],
        referencedColumnNames: ['Row'],
        referencedTableName: 't-Row',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Row',
      new TableForeignKey({
        columnNames: ['Sibling-Row'],
        referencedColumnNames: ['Row'],
        referencedTableName: 't-Row',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('t-Row');

    const pgForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('PG') !== -1,
    );
    await queryRunner.dropForeignKey('t-Row', pgForeignKey);

    const shareForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('Share') !== -1,
    );
    await queryRunner.dropForeignKey('t-Row', shareForeignKey);

    const primaryForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('Parent-Row') !== -1,
    );
    await queryRunner.dropForeignKey('t-Row', primaryForeignKey);

    const siblingForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('Sibling-Row') !== -1,
    );
    await queryRunner.dropForeignKey('t-Row', siblingForeignKey);

    await queryRunner.dropTable('t-Row', true);
  }
}
