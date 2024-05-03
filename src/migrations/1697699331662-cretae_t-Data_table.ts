import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class cretaeTDataTable1697699331662 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 't-Data',
        columns: [
          {
            name: 'Data',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'Data-Type',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'Row-Data',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'DateTime-Data',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'Color-Data',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'Int-Data',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'BigInt-Data',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'Num-Data',
            type: 'numeric',
            isNullable: true,
          },
          {
            name: 'JSON-Data',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'Qty-Data',
            type: 'numeric',
            isNullable: true,
          },
          {
            name: 'Unit-Data',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'Std-Qty-Data',
            type: 'numeric',
            isNullable: true,
          },
          {
            name: 'Std-Unit-Data',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'Foreign-Data',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.query(
      `ALTER SEQUENCE "t-Data_Data_seq" RESTART WITH 7000000001 INCREMENT BY 1`,
    );

    await queryRunner.createForeignKey(
      't-Data',
      new TableForeignKey({
        columnNames: ['Data-Type'],
        referencedColumnNames: ['Row'],
        referencedTableName: 't-Row',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Data',
      new TableForeignKey({
        columnNames: ['Unit-Data'],
        referencedColumnNames: ['Row'],
        referencedTableName: 't-Row',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Data',
      new TableForeignKey({
        columnNames: ['Std-Unit-Data'],
        referencedColumnNames: ['Row'],
        referencedTableName: 't-Row',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('t-Data');

    const DataTypeForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('Data-Type') !== -1,
    );
    await queryRunner.dropForeignKey('t-Data', DataTypeForeignKey);

    const UnitDataForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('Unit-Data') !== -1,
    );
    await queryRunner.dropForeignKey('t-Data', UnitDataForeignKey);

    const StdUnitDataForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('Std-Unit-Data') !== -1,
    );
    await queryRunner.dropForeignKey('t-Data', StdUnitDataForeignKey);

    await queryRunner.dropTable('t-Data', true);
  }
}
