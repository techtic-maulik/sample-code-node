import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Col } from 'src/modules/entity/tCol.entity';
import { Row } from 'src/modules/entity/tRow.entity';
import { Repository, EntityManager, FindManyOptions } from 'typeorm';
import {
  ACTIONS,
  COLUMNS,
  COLUMNS_CAPITAL,
  DDT_OBJECT,
  DEFAULT_LANGUAGE,
  TABLES,
  VARIABLE,
} from './constants';
import { CommonJSMethodService } from './commonjsMethods.service';

@Injectable()
export class PostgreSQLService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(Row)
    private readonly rowRepository: Repository<Row>,
    @InjectRepository(Col)
    private readonly columnRepository: Repository<Col>,
    @Inject(forwardRef(() => CommonJSMethodService))
    private readonly commonJSMethodService: CommonJSMethodService,
  ) {}

  async bulkInsert(
    repositry,
    tableName: string,
    insertData,
    overwriteCols,
    primaryIds,
  ) {
    try {
      await repositry
        .createQueryBuilder(tableName)
        .insert()
        .into(tableName)
        .values(insertData)
        .orUpdate({
          conflict_target: primaryIds,
          overwrite: overwriteCols,
        })
        .execute();
    } catch (err) {
      console.log('err bulk insert ', err);

      throw err;
    }
  }

  async getLastInsertedRow() {
    try {
      const lastInsertedRow = await this.rowRepository.find({
        skip: 0,
        take: 1,
        order: { Row: 'DESC' },
        select: { Row: true },
      });

      return lastInsertedRow[0].Row;
    } catch (err) {
      console.log('err last inserted ', err);

      throw err;
    }
  }

  async SelectQueryWith(
    SelectWithFields,
    tableWith,
    joinsWith,
    conditionWith,
    SelectFields,
    table,
    joins,
    condition,
    rowIDDataWithVariable,
  ) {
    try {
      const result = await this.entityManager.query(`
         WITH ${rowIDDataWithVariable} AS (
              SELECT
             ${SelectWithFields}
              FROM ${tableWith}
              ${joinsWith}
              ${conditionWith}
          )

              Select ${SelectFields}
              from ${table}
              ${joins}
              ${condition}
       `);

      return result;
    } catch (error) {
      throw error;
    }
  }
  async getPGIDByPGName(PGName) {
    try {
      const getPGID = await this.entityManager.query(`
         WITH RowIDData AS (
              SELECT
              "${TABLES[1].TABLE}"."${TABLES[1].FIELDS[0][COLUMNS_CAPITAL.ROW]}"
              FROM "${TABLES[6].TABLE}"
              Join "${TABLES[5].TABLE}" ON "${TABLES[5].TABLE}"."${
                TABLES[5].FIELDS[2][COLUMNS_CAPITAL.DATA]
              }" = "${TABLES[6].TABLE}"."${
                TABLES[6].FIELDS[0][COLUMNS_CAPITAL.DATA]
              }"
              join "${TABLES[4].TABLE}" ON "${TABLES[4].TABLE}"."${
                TABLES[4].FIELDS[0][COLUMNS_CAPITAL.CELL]
              }" = "${TABLES[5].TABLE}"."${
                TABLES[5].FIELDS[1][COLUMNS_CAPITAL.CELL]
              }"
			        join "${TABLES[1].TABLE}" ON "${TABLES[1].TABLE}"."${
                TABLES[1].FIELDS[0][COLUMNS_CAPITAL.ROW]
              }" = "${TABLES[4].TABLE}"."${
                TABLES[4].FIELDS[1][COLUMNS_CAPITAL.ROW]
              }"
              WHERE EXISTS (
                      SELECT 1
                      FROM jsonb_each_text("${
                        TABLES[6].FIELDS[8][COLUMNS_CAPITAL.JSON_DATA]
                      }") AS j
                      WHERE j.value = '${PGName}'
                  )
			        limit 1
          )

              Select "${TABLES[6].TABLE}"."${
                TABLES[6].FIELDS[6][COLUMNS_CAPITAL.BIGINT_DATA]
              }"
              from "${TABLES[6].TABLE}"
              join "${TABLES[5].TABLE}" on "${TABLES[5].TABLE}"."${
                TABLES[5].FIELDS[2][COLUMNS_CAPITAL.DATA]
              }" = "${TABLES[6].TABLE}"."${
                TABLES[6].FIELDS[0][COLUMNS_CAPITAL.DATA]
              }"
              join "${TABLES[4].TABLE}" as "tC" on "tC"."${
                TABLES[4].FIELDS[0][COLUMNS_CAPITAL.CELL]
              }" = "${TABLES[5].TABLE}"."${
                TABLES[5].FIELDS[1][COLUMNS_CAPITAL.CELL]
              }"
              join "${TABLES[1].TABLE}" on "${TABLES[1].TABLE}"."${
                TABLES[1].FIELDS[0][COLUMNS_CAPITAL.ROW]
              }" = "tC"."${TABLES[4].FIELDS[1][COLUMNS_CAPITAL.ROW]}"
              WHERE "tC"."${
                TABLES[4].FIELDS[1][COLUMNS_CAPITAL.ROW]
              }" IN (SELECT "${COLUMNS.ROW}" FROM RowIDData)
              AND "${TABLES[6].TABLE}"."${
                TABLES[6].FIELDS[6][COLUMNS_CAPITAL.BIGINT_DATA]
              }" IS NOT NULL
       `);

      return getPGID[0]?.[COLUMNS.BIGINT_DATA];
    } catch (error) {
      throw error;
    }
  }

  async getRowByJSONDataValue(text) {
    try {
      const getData = await this.entityManager.query(`
      SELECT "t-Row"."Row", "t-Data"."Data"
      FROM "t-Data"
      Join "t-Item" ON "t-Item"."Data" = "t-Data"."Data"
      join "t-Cell" ON "t-Cell"."Cell" = "t-Item"."Cell"
      join "t-Row" ON "t-Row"."Row" = "t-Cell"."Row"
      WHERE EXISTS (
        SELECT 1
        FROM jsonb_each_text("JSON-Data") AS j
        WHERE j.value = '${text}'
        )`);
      return getData[0];
    } catch (error) {
      throw error;
    }
  }

  async getJSONDataByDataID(id) {
    try {
      let englishRow = await this.getRowByJSONDataValue(
        DEFAULT_LANGUAGE.ENGLISH,
      );
      englishRow = englishRow.Row;
      const getData = await this.entityManager.query(`
      SELECT "JSON-Data" FROM "t-Data"
      WHERE "Data" = (${id});
      `);
      return getData[0]['JSON-Data'][englishRow];
    } catch (error) {
      throw error;
    }
  }

  async getDataIDByJSON(text, dataType, englishRow) {
    try {
      const getDataId = await this.entityManager.query(`
      SELECT "t-Data"."Data"
      FROM "t-Data"
      WHERE EXISTS (
        SELECT 1
        FROM jsonb_each_text("JSON-Data") AS j
        WHERE j.value = '${text}'
        )`);

      if (getDataId?.length) {
        return getDataId[0].Data;
      } else {
        const newDataResult = await this.entityManager
          .query(`INSERT INTO "t-Data"(
        "Data-Type", "JSON-Data")
        VALUES (${dataType}, '{${`"${englishRow}": "${text}"`}}'::jsonb) RETURNING "Data"`);

        return newDataResult[0].Data;
      }
    } catch (error) {
      throw error;
    }
  }

  async checkColumExists(columnName, pg, col) {
    try {
      let colQuery = `select * from "t-Col" where "PG" = ${pg}`;

      if (col) {
        colQuery += ` AND "Col" <> ${col}`;
      }
      const errorMessage = this.commonJSMethodService.duplicateErrorMessage(
        ACTIONS.EDIT.OBJECTS.EDITED,
        DDT_OBJECT[1].OBJECTS.COLUMN_NAME,
      );

      let existResult = await this.entityManager.query(colQuery);
      let filtered = [];

      for (let element of existResult) {
        for (let columnNameElement of Object.values(columnName)) {
          let columnElement: any = columnNameElement;
          let colFiltered = Object.values(element[COLUMNS.COL_NAME]).filter(
            (elementValue: any) =>
              elementValue.split(VARIABLE.STAR)[0] ===
              columnElement.split(VARIABLE.STAR)[0],
          );
          if (colFiltered.length) {
            filtered.push(colFiltered[0]);
          }
        }
      }
      return filtered;
    } catch (error) {
      throw error;
    }
  }

  async getDefaultDataID(data) {
    try {
      const findDefaultDataExists = await this.entityManager
        .query(`SELECT "Data", "JSON-Data"
      FROM "t-Data"
      LEFT JOIN LATERAL (
        SELECT 1
        FROM jsonb_each_text("JSON-Data") AS j
        WHERE jsonb_typeof("JSON-Data") = 'object' AND j.value = '${data.defaultData}' LIMIT 1
      ) AS exists_check ON true
      WHERE "Data-Type" = ${data.dataType}  AND exists_check IS NOT NULL
      LIMIT 1;`);

      if (findDefaultDataExists?.length) {
        return findDefaultDataExists[0].Data;
      } else {
        const newDataResult = await this.entityManager
          .query(`INSERT INTO "t-Data"(
        "Data-Type", "JSON-Data")
        VALUES (${
          data.dataType
        }, '{${`"${data.englishRow}": "${data.defaultData}"`}}'::jsonb) RETURNING "Data"`);

        return newDataResult[0].Data;
      }
    } catch (error) {
      throw error;
    }
  }

  async getColData(id) {
    try {
      let query = `
      SELECT "t-Col".*,
             "t-Format"."Default",
             "t-Format"."Status",
             "t-Format"."Formula",
             "t-Format"."Audit-Trail"
      FROM "t-Col"
      JOIN "t-Format" ON "t-Format"."Col" = "t-Col"."Col"
    `;

      if (id) {
        query += ` WHERE "t-Col"."Col" = $1`;
      }

      const data = await this.entityManager.query(query, id ? [id] : []);
      return data;
    } catch (error) {
      throw error;
    }
  }

  textToArray(text) {
    return text.replace('{', '').replace('}', '').split(',');
  }

  async getColumnsByPG(PG) {
    try {
      const condition: FindManyOptions<Col> = {
        where: {
          PG: PG,
        },
      };
      const columnResult = await this.columnRepository.find(condition);
      return columnResult;
    } catch (error) {
      throw error;
    }
  }

  async getRowByDDT(PG) {
    try {
      const condition: FindManyOptions<Col> = {
        where: {
          PG: PG,
        },
      };
      const columnResult = await this.columnRepository.find(condition);
      return columnResult;
    } catch (error) {
      throw error;
    }
  }
  async insertQuery(tableName, fields, values, condition, primaryKeyOnly) {
    try {
      fields = primaryKeyOnly ? fields : `(${fields})`;
      values = primaryKeyOnly ? values : `(${values})`;
      condition = condition ? condition : ``;

      let insertQuery = `INSERT INTO ${tableName} ${fields} VALUES ${values} ${condition};`;

      let insertResult = await this.entityManager.query(insertQuery);

      return insertResult;
    } catch (error) {
      throw error;
    }
  }

  async updateQuery(tableName, updates, condition) {
    try {
      condition = condition ? `WHERE ${condition}` : '';
      let updatePairs = Object.entries(updates)
        .map(([key, value]) => `"${key}" = ${value}`)
        .join(', ');

      let updateQuery = `UPDATE ${tableName} SET ${updatePairs} ${condition};`;

      let updateResult = await this.entityManager.query(updateQuery);

      return updateResult;
    } catch (error) {
      throw error;
    }
  }

  async removeQuery(tableName, condition) {
    try {
      condition = condition ? `WHERE ${condition}` : '';
      let removeQuery = `DELETE FROM ${tableName} ${condition};`;

      let removeResult = await this.entityManager.query(removeQuery);

      return removeResult;
    } catch (error) {
      throw error;
    }
  }

  async updateQueryBuilder(tableName, updates, condition) {
    try {
      const updateResult = await this.entityManager
        .createQueryBuilder()
        .update(tableName)
        .set(updates)
        .where(condition)
        .execute();

      return updateResult;
    } catch (error) {
      throw error;
    }
  }

  async selectQuery(options) {
    try {
      const { tables, fields, joins, condition } = options;

      let joinClauses = ``;
      if (joins) {
        for (let i = 0; i < joins.length; i++) {
          const [table] = joins[i];
          joinClauses += ` JOIN ${table}`;
        }
      }

      const selectQuery = `
      SELECT ${fields ? fields.map((field) => field).join(', ') : '*'}
      FROM "${tables}" ${joinClauses ? joinClauses : ``}
      WHERE ${condition};
    `;

      const result = await this.entityManager.query(selectQuery);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async checkIDExists(tableName, field, id) {
    try {
      let query = `
      SELECT *
      FROM "${tableName}"
      where "${field}" = ${id}
    `;

      return await this.entityManager.query(query);
    } catch (error) {
      throw error;
    }
  }
}
