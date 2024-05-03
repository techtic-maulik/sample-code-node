import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class createTCellTable1697699235667 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "t-Cell",
                columns: [
                    {
                        name: 'Cell',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                        isNullable: false
                    },
                    {
                        name: 'Row',
                        type: 'bigint',
                        isNullable: false
                    },
                    {
                        name: 'Col',
                        type: 'bigint',
                        isNullable: false
                    },
                    {
                        name: 'Cell-#of-Items',
                        type: 'integer',
                        isNullable: false
                    },
                ],
            }),
            true
        );

        await queryRunner.query(`ALTER SEQUENCE "t-Cell_Cell_seq" RESTART WITH 5000000001 INCREMENT BY 1`);

        await queryRunner.createForeignKey("t-Cell", new TableForeignKey({
            columnNames: ["Row"],
            referencedColumnNames: ["Row"],
            referencedTableName: "t-Row",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("t-Cell", new TableForeignKey({
            columnNames: ["Col"],
            referencedColumnNames: ["Col"],
            referencedTableName: "t-Col",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("t-Cell");

        const rowForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("Row") !== -1);
        await queryRunner.dropForeignKey("t-Cell", rowForeignKey);

        const colForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("Col") !== -1);
        await queryRunner.dropForeignKey("t-Cell", colForeignKey);

        await queryRunner.dropTable("t-Cell", true);
    }

}
