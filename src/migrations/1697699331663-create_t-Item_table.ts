import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class createTItemTable1697699331663 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "t-Item",
                columns: [
                    {
                        name: 'Item',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'Cell',
                        type: 'bigint',
                        isNullable: false,
                    },
                    {
                        name: 'Data',
                        type: 'bigint',
                        isNullable: false,
                    },
                    {
                        name: 'Inherit',
                        type: 'bigint[]',
                        isNullable: true,
                    },
                ],
            }),
            true
        );

        await queryRunner.query(`ALTER SEQUENCE "t-Item_Item_seq" RESTART WITH 6000000001 INCREMENT BY 1`);


        await queryRunner.createForeignKey("t-Item", new TableForeignKey({
            columnNames: ["Cell"],
            referencedColumnNames: ["Cell"],
            referencedTableName: "t-Cell",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("t-Item", new TableForeignKey({
            columnNames: ["Data"],
            referencedColumnNames: ["Data"],
            referencedTableName: "t-Data",
            onDelete: "CASCADE"
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("t-Item");

        const CellForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("Cell") !== -1);
        await queryRunner.dropForeignKey("t-Item", CellForeignKey);

        const DataForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("Data") !== -1);
        await queryRunner.dropForeignKey("t-Item", DataForeignKey);

        await queryRunner.dropTable("t-Item", true);
    }

}
