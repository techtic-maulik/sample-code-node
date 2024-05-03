import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createTFormatTable1697702675112 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 't-Format',
        columns: [
          {
            name: 'Format',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'PG',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'PG-Nested-Col',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'PG-Freeze-Col',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'PG-Expand',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'PG-Level-Set',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'PG-Search-Set',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'PG-Sort',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'PG-Filter',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'Row',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'ShowSet-Tick',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'Share',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'Col',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'Col-Order',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'Col-Min-Width',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'Cell',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'Item',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'Item-Order',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'Data',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'Default',
            type: 'bigint[]',
            isNullable: true,
          },
          {
            name: 'Status',
            type: 'bigint[]',
            isNullable: true,
          },
          {
            name: 'Unit',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'Font-Style',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'Formula',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'Comment',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'Audit-Trail',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'Deleted',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'Deleted-By',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'Deleted-At',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.query(
      `ALTER SEQUENCE "t-Format_Format_seq" RESTART WITH 8000000001 INCREMENT BY 1`,
    );

    await queryRunner.createForeignKey(
      't-Format',
      new TableForeignKey({
        columnNames: ['PG'],
        referencedColumnNames: ['PG'],
        referencedTableName: 't-PG',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Format',
      new TableForeignKey({
        columnNames: ['PG-Nested-Col'],
        referencedColumnNames: ['Col'],
        referencedTableName: 't-Col',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Format',
      new TableForeignKey({
        columnNames: ['PG-Level-Set'],
        referencedColumnNames: ['PG'],
        referencedTableName: 't-PG',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Format',
      new TableForeignKey({
        columnNames: ['PG-Search-Set'],
        referencedColumnNames: ['PG'],
        referencedTableName: 't-PG',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Format',
      new TableForeignKey({
        columnNames: ['Row'],
        referencedColumnNames: ['Row'],
        referencedTableName: 't-Row',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Format',
      new TableForeignKey({
        columnNames: ['ShowSet-Tick'],
        referencedColumnNames: ['Row'],
        referencedTableName: 't-Row',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Format',
      new TableForeignKey({
        columnNames: ['Share'],
        referencedColumnNames: ['Share'],
        referencedTableName: 't-Share',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Format',
      new TableForeignKey({
        columnNames: ['Col'],
        referencedColumnNames: ['Col'],
        referencedTableName: 't-Col',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Format',
      new TableForeignKey({
        columnNames: ['Cell'],
        referencedColumnNames: ['Cell'],
        referencedTableName: 't-Cell',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Format',
      new TableForeignKey({
        columnNames: ['Item'],
        referencedColumnNames: ['Item'],
        referencedTableName: 't-Item',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Format',
      new TableForeignKey({
        columnNames: ['Data'],
        referencedColumnNames: ['Data'],
        referencedTableName: 't-Data',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Format',
      new TableForeignKey({
        columnNames: ['Unit'],
        referencedColumnNames: ['Row'],
        referencedTableName: 't-Row',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Format',
      new TableForeignKey({
        columnNames: ['Deleted'],
        referencedColumnNames: ['Row'],
        referencedTableName: 't-Row',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      't-Format',
      new TableForeignKey({
        columnNames: ['Deleted-By'],
        referencedColumnNames: ['User'],
        referencedTableName: 't-User',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('t-Format');

    const PGForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('PG') !== -1,
    );
    await queryRunner.dropForeignKey('t-Format', PGForeignKey);

    const PGNestedColForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('PG-Nested-Col') !== -1,
    );
    await queryRunner.dropForeignKey('t-Format', PGNestedColForeignKey);

    const PGLevelSetForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('PG-Level-Set') !== -1,
    );
    await queryRunner.dropForeignKey('t-Format', PGLevelSetForeignKey);

    const PGSearchSetForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('PG-Search-Set') !== -1,
    );
    await queryRunner.dropForeignKey('t-Format', PGSearchSetForeignKey);

    const RowForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('Row') !== -1,
    );
    await queryRunner.dropForeignKey('t-Format', RowForeignKey);

    const ShowSetTickForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('ShowSet-Tick') !== -1,
    );
    await queryRunner.dropForeignKey('t-Format', ShowSetTickForeignKey);

    const ShareForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('Share') !== -1,
    );
    await queryRunner.dropForeignKey('t-Format', ShareForeignKey);

    const ColForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('Col') !== -1,
    );
    await queryRunner.dropForeignKey('t-Format', ColForeignKey);

    const CellForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('Cell') !== -1,
    );
    await queryRunner.dropForeignKey('t-Format', CellForeignKey);

    const ItemForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('Item') !== -1,
    );
    await queryRunner.dropForeignKey('t-Format', ItemForeignKey);

    const DataForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('Data') !== -1,
    );
    await queryRunner.dropForeignKey('t-Format', DataForeignKey);

    const UnitCellForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('Unit') !== -1,
    );
    await queryRunner.dropForeignKey('t-Format', UnitCellForeignKey);

    const DeletedCellForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('Deleted') !== -1,
    );
    await queryRunner.dropForeignKey('t-Format', DeletedCellForeignKey);

    const DeletedByCellForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('DeletedBy') !== -1,
    );
    await queryRunner.dropForeignKey('t-Format', DeletedByCellForeignKey);

    await queryRunner.dropTable('t-Format', true);
  }
}
