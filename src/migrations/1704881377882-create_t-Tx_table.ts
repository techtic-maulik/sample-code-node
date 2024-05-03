import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createTTxTable1704881377882 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 't-Tx',
        columns: [
          {
            name: 'Tx',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'Tx-Type',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'Tx-Objects',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'Tx-User',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'Tx-DateTime',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'Tx-XID',
            type: 'bigint',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.query(
      `ALTER SEQUENCE "t-Tx_Tx_seq" RESTART WITH 9000000001 INCREMENT BY 1`,
    );

    await queryRunner.createForeignKey(
      't-Tx',
      new TableForeignKey({
        columnNames: ['Tx-Type'],
        referencedColumnNames: ['Row'],
        referencedTableName: 't-Row',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      't-Tx',
      new TableForeignKey({
        columnNames: ['Tx-User'],
        referencedColumnNames: ['User'],
        referencedTableName: 't-User',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('t-Tx');

    const TxTypeForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('Tx-Type') !== -1,
    );
    await queryRunner.dropForeignKey('t-Tx', TxTypeForeignKey);

    const TxUserForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('Tx-User') !== -1,
    );
    await queryRunner.dropForeignKey('t-Tx', TxUserForeignKey);

    await queryRunner.dropTable('t-Tx', true);
  }
}
