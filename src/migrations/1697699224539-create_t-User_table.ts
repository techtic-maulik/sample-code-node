import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createTUserTable1697699224539 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 't-User',
        columns: [
          {
            name: 'User',
            type: 'bigint',
            isUnique: true,
            isNullable: false,
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      't-User',
      new TableForeignKey({
        columnNames: ['User'],
        referencedColumnNames: ['Row'],
        referencedTableName: 't-Row',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('t-User');

    const userForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('User') !== -1,
    );
    await queryRunner.dropForeignKey('t-User', userForeignKey);

    await queryRunner.dropTable('t-User', true);
  }
}
