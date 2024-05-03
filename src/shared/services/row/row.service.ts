import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateRowDto } from '../../../modules/row/dto/create-row.dto';
import { PostgreSQLService } from '..';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Row } from 'src/modules/entity/tRow.entity';
import { Cell } from 'src/modules/entity/tCell.entity';
import {
  COLUMNS,
  COLUMNS_CAPITAL,
  DATATYPE,
  NOTIFY,
  TABLES,
} from 'src/common/constants';

@Injectable()
export class RowService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(Row) private readonly rowRepository: Repository<Row>,
    @InjectRepository(Cell) private readonly cellRepository: Repository<Cell>,
    @Inject(forwardRef(() => PostgreSQLService))
    private readonly postgreSQLService: PostgreSQLService,
  ) {}

  async generateRow(): Promise<any> {
    try {
      let lastInsertedRow = await this.postgreSQLService.getLastInsertedRow();
      lastInsertedRow = lastInsertedRow + 1;
      return { Row: lastInsertedRow, RowID: lastInsertedRow };
    } catch (error) {
      throw error;
    }
  }

  async create(body: CreateRowDto): Promise<any> {
    try {
      const checkRowExists = await this.checkRowAlreadyExists(body.Row);
      if (checkRowExists) {
        throw new Error('Row already exists!');
      } else {
        let parentResult = null,
          siblingRow = null,
          rowLevel = 0;

        const parentRow = body.selectedRow;

        switch (body.type) {
          case 'previous':
            break;
          case 'next':
            const siblingData = await this.getSiblingsByRow(body.selectedRow);

            let index = siblingData.findIndex(
              (obj) => obj['Row'] === body.selectedRow,
            );
            const nextSiblingIndex = index + 1;
            const previousSiblingIndex = index - 1;

            const previousSibling = siblingData[previousSiblingIndex];
            const nextSibling = siblingData[nextSiblingIndex];
            if (previousSibling) {
              siblingRow = previousSibling[0].Row;
            }

            break;
          case 'child': //child is added at last if other children are present
            const childrenResult = await this.getParentAndChildrenByRow(
              body.selectedRow,
            );

            parentResult = [childrenResult.shift()];

            rowLevel = Number(parentResult[0]['Row-Level']) + 1;

            if (childrenResult?.length) {
              siblingRow = Number(
                childrenResult[childrenResult?.length - 1].Row,
              );
            }

            const rowData = new Row();

            rowData.PG = Number(body.PG);
            rowData.Row = Number(body.Row);
            rowData.RowID = Number(body.RowID);
            rowData['Row-Level'] = Number(rowLevel);
            rowData['Parent-Row'] = Number(parentRow);
            rowData['Sibling-Row'] = siblingRow;

            console.log('rowData=', rowData);

            // await this.rowRepository.save(rowData);

            const tgColumns = await this.postgreSQLService.getColumnsByPG(
              body.PG,
            );

            for (let tc in tgColumns) {
              const cellData = new Cell();

              let columnName = Object.values(tgColumns[tc]['Col-Name'])[0];
              // columnName = columnName[0];
              // cellData.Row = Number(body.Row);
              // cellData.Col = Number(body.Col);
              // cellData['Cell-#of-Items*'] = 1;

              // console.log('rowData=', rowData);
            }
            break;
        }

        return;
      }
    } catch (error) {
      throw error;
    }
  }

  async getParentAndChildrenByRow(row) {
    try {
      const childResult = await this.entityManager
        .query(`WITH RECURSIVE children AS (
        SELECT tr.*
        FROM "t-Row" tr
        WHERE "Row" = (${row})
        UNION
        SELECT r.*
        FROM "t-Row" r
        JOIN children d ON r."Parent-Row" = d."Row"
      ) SELECT children.* from children`);
      return childResult;
    } catch (error) {
      throw error;
    }
  }
  async checkRowAlreadyExists(row) {
    try {
      const condition: FindOneOptions<Row> = {
        where: {
          Row: row,
        },
      };
      const existResult = await this.rowRepository.findOne(condition);
      return existResult;
    } catch (error) {
      throw error;
    }
  }

  async getSiblingsByRow(childRow) {
    try {
      const siblingQuery = await this.entityManager
        .query(`SELECT * FROM "t-Row" where "Parent-Row"  = (select "Parent-Row"  from "t-Row" where "Row" = ${childRow} 
      )`);

      return siblingQuery;
    } catch (error) {
      throw error;
    }
  }

  async formatRow(body: any): Promise<any> {
    try {
      //To Do: On Audit Trail, user can switch to previous versions. insert font style in updated object
      let fontStyleRow = await this.postgreSQLService.getRowByJSONDataValue(
        DATATYPE.FONT_STYLE,
      );

      fontStyleRow = fontStyleRow.Row;

      await this.entityManager.query(`BEGIN`);
      //check same data is present else insert

      let checkFontStyleDataExists = await this.postgreSQLService.selectQuery({
        tables: TABLES[6].TABLE,
        fields: [`"${(TABLES[6].FIELDS[0] as any).DATA}"`],
        joins: false,
        condition: `"${
          (TABLES[6].FIELDS[1] as any).DATA_TYPE
        }" = ${fontStyleRow} AND "${
          (TABLES[6].FIELDS[8] as any).JSON_DATA
        }" = '${JSON.stringify(body['Font-Style'])}'::jsonb`,
      });

      if (!checkFontStyleDataExists.length) {
        await this.postgreSQLService.insertQuery(
          `"${TABLES[6].TABLE}"`, //insert all thefont-style into a single t-Data.JSON-data
          `"${(TABLES[6].FIELDS[1] as any).DATA_TYPE}" , "${
            (TABLES[6].FIELDS[8] as any).JSON_DATA
          }"`,
          `${fontStyleRow}, '${JSON.stringify(body['Font-Style'])}'::jsonb`,
          null,
          false,
        );
      }
      let fieldCondition =
        body.type == 'localRow'
          ? (TABLES[7].FIELDS[22] as any).ROW
          : (TABLES[7].FIELDS[24] as any).SHARE;

      let bodyRowCondition =
        body.type == 'localRow' ? body.Row : body.sharedRow;

      let checkRowFormatExists = await this.postgreSQLService.selectQuery({
        tables: TABLES[7].TABLE,
        fields: [`"${(TABLES[7].FIELDS[0] as any).FORMAT}"`],
        joins: false,
        condition: `"${fieldCondition}" = ${bodyRowCondition}`,
      });

      if (!checkRowFormatExists.length) {
        await this.postgreSQLService.insertQuery(
          `"${TABLES[7].TABLE}"`,
          `"${fieldCondition}" ,"${
            (TABLES[7].FIELDS[4] as any).STATUS
          }" , "${(TABLES[7].FIELDS[26] as any).FONT_STYLE}" , "${
            (TABLES[7].FIELDS[28] as any).COMMENT
          }" , "${(TABLES[7].FIELDS[29] as any).AUDIT_TRAIL}" `,
          `${bodyRowCondition} , Array[${body['Status']}] , '${JSON.stringify(
            body['Font-Style'],
          )}'::jsonb , '${JSON.stringify(
            body['Comment'],
          )}'::jsonb , '${JSON.stringify(body['Audit-Trail'])}'::jsonb`,
          null,
          false,
        ); //audit trail
      } else {
        await this.postgreSQLService.updateQuery(
          `"${TABLES[7].TABLE}"`,
          {
            [(TABLES[7].FIELDS[4] as any).STATUS]: `Array[${body['Status']}]`,
            [(TABLES[7].FIELDS[26] as any).FONT_STYLE]: `'${JSON.stringify(
              body['Font-Style'],
            )}'::jsonb`,
            [(TABLES[7].FIELDS[28] as any).COMMENT]: `'${JSON.stringify(
              body['Comment'],
            )}'::jsonb`,
            [(TABLES[7].FIELDS[29] as any).AUDIT_TRAIL]: `'${JSON.stringify(
              body['Audit-Trail'],
            )}'::jsonb`,
          },
          `"${fieldCondition}" = ${bodyRowCondition}`,
        );
      }
      await this.postgreSQLService.updateQuery(
        `"${TABLES[1].TABLE}"`,
        {
          [(TABLES[1].FIELDS[8] as any).ROW_TYPE]: `${body['Row-Type']}`,
        },
        `"${COLUMNS.ROW}" = ${body.Row}`,
      );
      const txId = await this.entityManager.query('SELECT txid_current()');
      // insert into transaction table
      // await this.postgreSQLService.insertQuery(
      //   `"${TABLES[8].TABLE}"`,
      //   `"${(TABLES[8].FIELDS[1] as any).TX_TYPE}", "${
      //     (TABLES[8].FIELDS[2] as any).TX_OBJECTS
      //   }", "${(TABLES[8].FIELDS[3] as any).TX_USER}", "${
      //     (TABLES[8].FIELDS[4] as any).TX_DATETIME
      //   }", "${(TABLES[8].FIELDS[5] as any).TX_XID}"`,
      //   `${body.contextMenuRow}, '${JSON.stringify(
      //     txObj,
      //   )}'::jsonb, null, CURRENT_TIMESTAMP, ${txId[0].txid_current}`,
      //   null,
      //   false,
      // );
      //insert into audit trail for font style info in t-Data
      await this.entityManager.query(`END`);
      return {
        status: 200,
        message: `${NOTIFY.SUCCESS} `,
      };
    } catch (error) {
      throw error;
    }
  }
}
