import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { isEqual } from 'lodash';
import { CreateColumnDto } from '../../../modules/column/dto/create-column.dto';
import { EntityManager, FindOneOptions, In, Not, Repository } from 'typeorm';
import { PostgreSQLService } from '../../../common/postgresql.service';
import {
  ACTIONS,
  BOOLEAN_VALUE,
  COLUMNS,
  COLUMNS_CAPITAL,
  DATATYPE,
  DDT_OBJECT,
  DEFAULT_LANGUAGE,
  MESSAGE,
  OTHERS,
  OTHER_COLUMNS,
  ROWS,
  STATUS,
  TABLES,
  VARIABLE,
  NOTIFY,
} from '../../../common/constants';
import { Col } from 'src/modules/entity/tCol.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Format } from 'src/modules/entity/tFormat.entity';
import { CommonJSMethodService } from '../../../common/commonjsMethods.service';
import { TgService } from '../tg/tg.service';

@Injectable()
export class ColumnService {
  constructor(
    private readonly entityManager: EntityManager,
    @Inject(forwardRef(() => PostgreSQLService))
    private readonly postgreSQLService: PostgreSQLService,
    @Inject(forwardRef(() => CommonJSMethodService))
    private readonly commonJSMethodService: CommonJSMethodService,
    @InjectRepository(Col) private readonly colRepository: Repository<Col>,
    @InjectRepository(Format)
    private readonly formatRepository: Repository<Format>,
    @Inject(forwardRef(() => TgService))
    private readonly tgService: TgService,
  ) {}

  async create(body: CreateColumnDto): Promise<any> {
    let Col, Cell, dataID;
    const calcFormula = [],
      obj = {};
    let finalCalcFormula;

    const errorMessage = this.commonJSMethodService.duplicateErrorMessage(
      ACTIONS.EDIT.OBJECTS.EDITED,
      DDT_OBJECT[1].OBJECTS.COLUMN_NAME,
    );

    let englishRow = await this.postgreSQLService.getRowByJSONDataValue(
      DEFAULT_LANGUAGE.ENGLISH,
    );
    englishRow = englishRow.Row;

    let columnMandatoryRow = await this.postgreSQLService.getRowByJSONDataValue(
      STATUS.MANDATOR_COLUMN,
    );
    columnMandatoryRow = columnMandatoryRow.Row;

    const mandatoryColObj =
      await this.commonJSMethodService.checkMandatoryColumns(
        ACTIONS.EDIT.OBJECTS.EDITED,
        DDT_OBJECT[1].OBJECTS.COLUMN_NAME,
        this.postgreSQLService,
        body[COLUMNS.STATUS],
        body[COLUMNS.COL_NAME],
      );

    let findDDTs = async (field) => {
      try {
        return await this.commonJSMethodService.allDataIDs(
          body[COLUMNS.DEFAULT],
          this.postgreSQLService,
          field,
          body[COLUMNS.DATA_TYPE],
        );
      } catch (error) {
        console.log({ error });
        throw error;
      }
    };

    let colDataType =
      await this.commonJSMethodService.findDataNameByRowIDUsingQuery(
        this.postgreSQLService,
        body[COLUMNS.DATA_TYPE],
      );

    finalCalcFormula =
      body[COLUMNS.FORMULA] && Object.values(body[COLUMNS.FORMULA])?.length
        ? `'${JSON.stringify(body[COLUMNS.FORMULA])}'::jsonb`
        : null;

    if (!body[COLUMNS.COL]) {
      /**
       * Insert Column
       */
      try {
        let colResult = null;
        // Check column name exists or not in the t-Col table.
        const checkColumnExists = await this.postgreSQLService.checkColumExists(
          mandatoryColObj,
          body[COLUMNS.PG],
          false,
        );

        // Condition for "Col-Name" if already exis
        if (checkColumnExists?.length) {
          throw new Error(errorMessage.message);
        } else {
          // Get RowID of Status "False"
          let falseRow = await this.postgreSQLService.getRowByJSONDataValue(
            BOOLEAN_VALUE.FALSE_CAPS,
          );
          falseRow = falseRow.Row;

          body.Status = body.Status?.length ? body.Status : [];

          const finalColumnResult = `$$${JSON.stringify(mandatoryColObj)}$$`;

          let selectColFormat = await this.postgreSQLService.selectQuery({
            tables: TABLES[2].TABLE,
            fields: [
              `"${TABLES[2].TABLE}"."${
                TABLES[2].FIELDS[0][COLUMNS_CAPITAL.COL]
              }"`,
              `"${TABLES[2].TABLE}"."${
                TABLES[2].FIELDS[1][COLUMNS_CAPITAL.PG]
              }"`,
              `"${TABLES[7].TABLE}"."${
                TABLES[7].FIELDS[0][COLUMNS_CAPITAL.FORMAT]
              }"`,
              `"${TABLES[7].TABLE}"."${
                TABLES[7].FIELDS[2][COLUMNS_CAPITAL.COL_ORDER]
              }"`,
            ],
            joins: [
              [
                `"${TABLES[7].TABLE}" ON "${TABLES[7].TABLE}"."${
                  TABLES[7].FIELDS[1][COLUMNS_CAPITAL.COL]
                }" = "${TABLES[2].TABLE}"."${
                  TABLES[2].FIELDS[0][COLUMNS_CAPITAL.COL]
                }"`,
              ],
            ],
            condition: `"${TABLES[2].TABLE}"."${
              TABLES[2].FIELDS[1][COLUMNS_CAPITAL.PG]
            }" = ${body[COLUMNS.PG]} AND "${
              TABLES[7].FIELDS[2][COLUMNS_CAPITAL.COL_ORDER]
            }" >= ${body[COLUMNS.COL_ORDER]}`,
          });

          await this.entityManager.query(`BEGIN`);

          for (let element of selectColFormat) {
            await this.postgreSQLService.updateQueryBuilder(
              TABLES[7].TABLE,
              {
                [COLUMNS.COL_ORDER]: element[COLUMNS.COL_ORDER] + 1,
              },
              `"${COLUMNS.FORMAT}" = ${element[COLUMNS.FORMAT]}`,
            );
          }

          // Insert in the t-Col
          colResult = await this.postgreSQLService.insertQuery(
            `"${TABLES[2].TABLE}"`,
            `"${COLUMNS.PG}", "${COLUMNS.COL_NAME}", "${COLUMNS.DATA_TYPE}", "${COLUMNS.DDT_SOURCE}"`,
            `${body.PG}, ${finalColumnResult}, ${body[COLUMNS.DATA_TYPE]}, ${
              body[COLUMNS.DDT_SOURCE]?.length
                ? `Array[${body[COLUMNS.DDT_SOURCE]}]`
                : null
            }`,
            'RETURNING *',
            false,
          );
          Col = colResult[0].Col;

          const date = await this.commonJSMethodService.getCurrentTimestamp();
          const auditTrail = `[{
                    "tableName": "${TABLES[2].TABLE}",
                    "id": "${Col}",
                    "inserted": {
                        "${COLUMNS.PG}": "${body.PG}",
                        "${COLUMNS.COL_NAME}": ${JSON.stringify(
                          mandatoryColObj,
                        )},
                        "${COLUMNS.DATA_TYPE}": "${body[COLUMNS.DATA_TYPE]}",
                        "${COLUMNS.DDT_SOURCE}": "${body[COLUMNS.DDT_SOURCE]}",
                        "insertedAt": "${date}",
                        "insertedBy": ""
                    }
                  }]`;

          if (body.Default?.length) {
            const cellResult = await this.postgreSQLService.insertQuery(
              `"${TABLES[4].TABLE}"`,
              `"${COLUMNS.ROW}", "${COLUMNS.COL}", "${COLUMNS.CELL_OF_ITEMS}"`,
              `0, ${Col}, ${body.Default?.length}`,
              'RETURNING *',
              false,
            );
            Cell = cellResult[0].Cell;

            switch (colDataType) {
              case DATATYPE.ROW_ID:
              case DATATYPE.USER_ID:
              case DATATYPE.DDT:
                // Code for t-Data.Row-Data
                dataID = await findDDTs(
                  TABLES[6].FIELDS[2][COLUMNS_CAPITAL.ROW_DATA],
                );
                break;
              case DATATYPE.DATETIME:
                // Code for t-Data.DateTime-Data
                dataID = await findDDTs(
                  TABLES[6].FIELDS[3][COLUMNS_CAPITAL.DATETIME_DATA],
                );
                break;
              case DATATYPE.COLOR:
                // Code for Color-Data
                dataID = await findDDTs(
                  TABLES[6].FIELDS[4][COLUMNS_CAPITAL.COLOR_DATA],
                );
                break;
              case DATATYPE.INT:
                // Code for Int-Data
                dataID = await findDDTs(
                  TABLES[6].FIELDS[5][COLUMNS_CAPITAL.INT_DATA],
                );
                break;
              case DATATYPE.BIGINT:
              case DATATYPE.PGID:
              case DATATYPE.CATEGORY_ID:
              case DATATYPE.SEARCH_SET_ID:
                // Code for BigInt-Data
                dataID = await findDDTs(
                  TABLES[6].FIELDS[6][COLUMNS_CAPITAL.BIGINT_DATA],
                );
                break;
              case DATATYPE.NUM:
              case DATATYPE.PERCENTAGE:
                // code for num-Data
                dataID = await findDDTs(
                  TABLES[6].FIELDS[7][COLUMNS_CAPITAL.NUM_DATA],
                );
                break;

              case DATATYPE.UNIT:
                // code for num-Data
                dataID = await findDDTs(
                  TABLES[6].FIELDS[10][COLUMNS_CAPITAL.UNIT_DATA],
                );
                break;
              case DATATYPE.TEXT:
              case DATATYPE.ML_TEXT:
              case DATATYPE.FORMULA:
              case DATATYPE.VALID_FORMAT:
              case DATATYPE.FONT_STYLE:
              case DATATYPE.URL:
              case DATATYPE.JSON:
              case DATATYPE.VALUE_DATA_TYPE:
              case DATATYPE.AMOUNT:
                // code for JSON-Data
                dataID = await findDDTs(
                  TABLES[6].FIELDS[8][COLUMNS_CAPITAL.JSON_DATA],
                );
                break;
            }
          }

          if (dataID?.length) {
            //Initialize dataID value to DataID field
            for (let element of dataID) {
              await this.postgreSQLService.insertQuery(
                `"${TABLES[5].TABLE}"`,
                `"${COLUMNS.CELL}", "${COLUMNS.DATA}"`,
                `${Cell}, ${element}`,
                'RETURNING *',
                false,
              );
            }
          }

          // Insert in the t-Format
          await this.postgreSQLService.insertQuery(
            `"${TABLES[7].TABLE}"`,
            `"${COLUMNS.COL}","${COLUMNS.COL_ORDER}", "${COLUMNS.STATUS}", "${COLUMNS.DEFAULT}", "${COLUMNS.FORMULA}", "${COLUMNS.AUDIT_TRAIL}", "${COLUMNS.DELETED}"`,
            `${Col}, ${body[COLUMNS.COL_ORDER]},${
              body.Status?.length ? `Array[${body.Status}]` : 'null'
            }, ${
              Cell?.length ? Cell : null
            }, ${finalCalcFormula}, '${auditTrail}'::jsonb, ${falseRow}`,
            false,
            false,
          );

          await this.entityManager.query('COMMIT');
          await this.tgService.getById(body[COLUMNS.PG]);
        }

        return { status: 200, message: MESSAGE.SUCCESSFULLY_INSERTED_COLUMNS };
      } catch (error) {
        await this.entityManager.query(`ROLLBACK`);
        throw error;
      }
    } else {
      /**
       * Update Column
       */
      try {
        // // The 'getColData' function accepts 'id' as a parameter because we don't have a specific ID for searching, so we've kept it as 'undefined'. As a result, it will return the entire column's data.
        let getAllColData = await this.postgreSQLService.getColData(undefined);

        let findColData = getAllColData.filter(
          (element) => element[COLUMNS.COL] == body[COLUMNS.COL],
        );
        // Check column name exists or not in the t-Col table.
        const checkColumnExists = await this.postgreSQLService.checkColumExists(
          mandatoryColObj,
          body[COLUMNS.PG],
          body[COLUMNS.COL],
        );

        if (findColData?.length) {
          // Condition for "Col-Name" if already exists
          if (checkColumnExists?.length) {
            throw new Error(errorMessage.message);
          }

          if (body[COLUMNS.DEFAULT]?.length) {
            // Find CellID by col and Row = 0
            let cellID = await this.postgreSQLService.selectQuery({
              tables: TABLES[4].TABLE,
              fields: [`"${TABLES[4].FIELDS[0][COLUMNS_CAPITAL.CELL]}"`],
              joins: false,
              condition: `"${TABLES[4].FIELDS[2][COLUMNS_CAPITAL.COL]}" = ${
                body[COLUMNS.COL]
              } AND "${TABLES[4].FIELDS[1][COLUMNS_CAPITAL.ROW]}" = 0`,
            });
            if (cellID?.length) {
              Cell = cellID[0].Cell;
              /**
               * Start:- Update: t-Cell
               */

              await this.postgreSQLService.updateQueryBuilder(
                TABLES[4].TABLE, // Table Name
                {
                  [COLUMNS.CELL_OF_ITEMS]: body.Default?.length,
                },
                `"${COLUMNS.COL}" = ${body[COLUMNS.COL]} AND "${
                  COLUMNS.ROW
                }" = 0`,
              );
              /**
               * END
               */
            } else {
              const cellResult = await this.postgreSQLService.insertQuery(
                `"${TABLES[4].TABLE}"`,
                `"${COLUMNS.ROW}", "${COLUMNS.COL}", "${COLUMNS.CELL_OF_ITEMS}"`,
                `0, ${body[COLUMNS.COL]}, ${body.Default?.length}`,
                'RETURNING *',
                false,
              );
              Cell = cellResult[0].Cell;
            }

            switch (colDataType) {
              case DATATYPE.ROW_ID:
              case DATATYPE.USER_ID:
              case DATATYPE.DDT:
                // Code for t-Data.Row-Data
                dataID = await findDDTs(
                  TABLES[6].FIELDS[2][COLUMNS_CAPITAL.ROW_DATA],
                );
                break;
              case DATATYPE.DATETIME:
                // Code for t-Data.DateTime-Data
                dataID = await findDDTs(
                  TABLES[6].FIELDS[3][COLUMNS_CAPITAL.DATETIME_DATA],
                );
                break;
              case DATATYPE.COLOR:
                // Code for Color-Data
                dataID = await findDDTs(
                  TABLES[6].FIELDS[4][COLUMNS_CAPITAL.COLOR_DATA],
                );
                break;
              case DATATYPE.INT:
                // Code for Int-Data
                dataID = await findDDTs(
                  TABLES[6].FIELDS[5][COLUMNS_CAPITAL.INT_DATA],
                );
                break;
              case DATATYPE.BIGINT:
              case DATATYPE.PGID:
              case DATATYPE.CATEGORY_ID:
              case DATATYPE.SEARCH_SET_ID:
                // Code for BigInt-Data
                dataID = await findDDTs(
                  TABLES[6].FIELDS[6][COLUMNS_CAPITAL.BIGINT_DATA],
                );
                break;
              case DATATYPE.NUM:
              case DATATYPE.PERCENTAGE:
                // code for num-Data
                dataID = await findDDTs(
                  TABLES[6].FIELDS[7][COLUMNS_CAPITAL.NUM_DATA],
                );
                break;

              case DATATYPE.UNIT:
                // code for num-Data
                dataID = await findDDTs(
                  TABLES[6].FIELDS[10][COLUMNS_CAPITAL.UNIT_DATA],
                );
                break;
              case DATATYPE.TEXT:
              case DATATYPE.ML_TEXT:
              case DATATYPE.FORMULA:
              case DATATYPE.VALID_FORMAT:
              case DATATYPE.FONT_STYLE:
              case DATATYPE.URL:
              case DATATYPE.JSON:
              case DATATYPE.VALUE_DATA_TYPE:
              case DATATYPE.AMOUNT:
                // code for JSON-Data
                dataID = await findDDTs(
                  TABLES[6].FIELDS[8][COLUMNS_CAPITAL.JSON_DATA],
                );
                break;
            }

            //Initialize dataID value to DataID field
            let itemResult = await this.postgreSQLService.selectQuery({
              tables: TABLES[5].TABLE,
              fields: [
                `"${TABLES[5].FIELDS[0][COLUMNS_CAPITAL.ITEM]}", 
              "${TABLES[5].FIELDS[2][COLUMNS_CAPITAL.DATA]}"`,
              ],
              joins: false,
              condition: `"${
                TABLES[5].FIELDS[1][COLUMNS_CAPITAL.CELL]
              }" = ${Cell}`,
            });

            if (dataID?.length) {
              // 1. Data IDs present in dataID but not in itemResult
              const dataIDNotInItemResult = dataID.filter(
                (id) => !itemResult.some((item) => item.Data === id),
              );

              // 2. Data IDs present in itemResult but not in dataID
              const dataIDInItemResultNotInData = itemResult
                .filter((item) => !dataID.includes(item.Data))
                .map((item) => item.Data);

              if (dataIDNotInItemResult?.length) {
                for (let element of dataIDNotInItemResult) {
                  await this.postgreSQLService.insertQuery(
                    `"${TABLES[5].TABLE}"`,
                    `"${COLUMNS.CELL}", "${COLUMNS.DATA}"`,
                    `${Cell}, ${element}`,
                    'RETURNING *',
                    false,
                  );
                }
              }

              if (dataIDInItemResultNotInData?.length) {
                await this.postgreSQLService.removeQuery(
                  `"${TABLES[5].TABLE}"`,
                  `"${
                    TABLES[5].FIELDS[1][COLUMNS_CAPITAL.CELL]
                  }" = ${Cell} AND "${
                    TABLES[5].FIELDS[2][COLUMNS_CAPITAL.DATA]
                  }" IN (${dataIDInItemResultNotInData})`,
                );
              }
            }
          }

          const date = await this.commonJSMethodService.getCurrentTimestamp();
          // Remove "PG", "Col" and "Audit-Trail" field from findColData array
          let finalResponse = findColData.map(
            ({ PG, Col, [COLUMNS.AUDIT_TRAIL]: colAuditTrail, ...rest }) => ({
              ...rest,
            }),
          );

          // Remove PG field from body
          const { PG, Col, ...newBody } = body;

          // Making response object as same as req.body for comparision
          let checkFinalResponse = await Promise.all(
            finalResponse.map(async (element) => {
              return {
                [COLUMNS.COL_NAME]: Object.values(element[COLUMNS.COL_NAME])[0],
                [COLUMNS.DATA_TYPE]: element[COLUMNS.DATA_TYPE],
                [COLUMNS.DDT_SOURCE]: element[COLUMNS.DDT_SOURCE]?.length
                  ? this.postgreSQLService.textToArray(
                      element[COLUMNS.DDT_SOURCE],
                    )
                  : null,
                [COLUMNS.DEFAULT]: Cell ? Cell : null,
                [COLUMNS.STATUS]: this.postgreSQLService.textToArray(
                  element[COLUMNS.STATUS],
                ),
                [COLUMNS.FORMULA]: element[COLUMNS.FORMULA]
                  ? element[COLUMNS.FORMULA]
                  : null,
              };
            }),
          );
          checkFinalResponse = checkFinalResponse[0];

          // Check if body or existing data are equal or not.
          const areEqual = isEqual(newBody, checkFinalResponse);

          if (checkFinalResponse && !areEqual) {
            let updateObj = {
              PG: findColData[0].PG,
              current: checkFinalResponse,
              previous: finalResponse[0],
              updatedAt: date,
              updatedBy: '',
            };
            let auditTrail;
            let response;
            // If findColData have a field Audit-Trail
            if (findColData[0][COLUMNS.AUDIT_TRAIL]) {
              let obj;
              auditTrail = await findColData[0][COLUMNS.AUDIT_TRAIL].map(
                (element) => {
                  response = Object.keys(element).filter(
                    (keyElement) => keyElement === 'updated',
                  );
                  if (response?.length) {
                    element['updated'].push(updateObj);
                    obj = element;
                  } else {
                    obj = {
                      ...element,
                      updated: [updateObj],
                    };
                  }
                  return obj;
                },
              );
            } else {
              auditTrail = [
                {
                  tableName: TABLES[2].TABLE,
                  id: findColData[0].Col,
                  updated: [updateObj],
                },
              ];
            }

            await this.entityManager.query(`BEGIN`);

            /**
             * Start:- Update: t-Col
             */
            const updateColField = {
              [COLUMNS.COL_NAME]: `'${JSON.stringify(mandatoryColObj)}'::jsonb`,
              [COLUMNS.DATA_TYPE]: body[COLUMNS.DATA_TYPE],
              [COLUMNS.DDT_SOURCE]: body[COLUMNS.DDT_SOURCE]?.length
                ? `ARRAY[${body[COLUMNS.DDT_SOURCE]}]`
                : null,
            };

            await this.postgreSQLService.updateQuery(
              `"${TABLES[2].TABLE}"`, // Table Name
              updateColField,
              `"${COLUMNS.COL}" = ${body[COLUMNS.COL]}`,
            );

            /**
             * END
             */

            /**
             * Start:- Update: t-Format
             */
            let updateFormatFields = {
              [COLUMNS.DEFAULT]: Cell ? Cell : null,
              [COLUMNS.STATUS]: `ARRAY[${body[COLUMNS.STATUS]}]`,
              [COLUMNS.FORMULA]: finalCalcFormula,
              [COLUMNS.AUDIT_TRAIL]: `'${JSON.stringify(auditTrail)}'::jsonb`,
            };

            await this.postgreSQLService.updateQuery(
              `"${TABLES[7].TABLE}"`,
              updateFormatFields,
              `"${COLUMNS.COL}" = ${body[COLUMNS.COL]}`,
            );
            /**
             * END
             */

            await this.entityManager.query(OTHERS.COMMIT);

            await this.tgService.getById(body[COLUMNS.PG]);
          }
          return {
            status: 200,
            message: MESSAGE.SUCCESSFULLY_UPDATED_COLUMNS,
          };
        } else {
          let errorMessage = this.commonJSMethodService.notFoundErrorMessage(
            ACTIONS.EDIT.OBJECTS.EDITED,
            DDT_OBJECT[1].OBJECTS.COLUMN_NAME,
          );

          return errorMessage;
        }
      } catch (error) {
        console.log({ error });
        await this.entityManager.query(`ROLLBACK`);
        throw error;
      }
    }
  }

  async delete(id, body): Promise<any> {
    try {
      /**
       * Delete a Col (except any of the Initial-Col’s, Nested-Col and 'Inherited Item' ,Data(s) - only if it is not being use in another Item.)
       * Delete from tables: Col, Format record of Col, Cell(s), FR of Cell(s), Item(s), FR of Item(s), Data(s)
       */
      let columnCellsID,
        itemCells,
        itemCellsID = null,
        dataItemID = null,
        auditTrail = [],
        dataToDelete = [],
        currentTimestamp,
        cellToDelete = [],
        itemToDelete = [];

      const txObj = { deleted: [] };

      const columnsPG = await this.postgreSQLService.selectQuery({
        tables: TABLES[2].TABLE,
        fields: [`"${TABLES[2].FIELDS[1][COLUMNS.PG]}"`],
        joins: null,
        condition: ` "${(TABLES[2].FIELDS[0] as any).COL}" = ${id}`,
      });
      const nestedColumn = await this.postgreSQLService.selectQuery({
        tables: TABLES[7].TABLE,
        fields: null,
        joins: null,
        condition: ` "${(TABLES[7].FIELDS[1] as any).COL}" = ${id}`,
      });

      let trueRowID = await this.postgreSQLService.getRowByJSONDataValue(
        BOOLEAN_VALUE.TRUE_CAPS,
      );
      trueRowID = trueRowID.Row;

      try {
        await this.entityManager.query(`BEGIN`);

        // Update col as deleted in t-Format
        currentTimestamp =
          await this.commonJSMethodService.getCurrentTimestamp();
        if (nestedColumn[0][COLUMNS.AUDIT_TRAIL]) {
          auditTrail = nestedColumn[0][COLUMNS.AUDIT_TRAIL].deleted?.length
            ? nestedColumn[0][COLUMNS.AUDIT_TRAIL].deleted.push({
                Col: id,
                deletedAt: currentTimestamp,
                deletedBy: '',
              })
            : (nestedColumn[0][COLUMNS.AUDIT_TRAIL].deleted = [
                {
                  Col: id,
                  deletedAt: currentTimestamp,
                  deletedBy: '',
                },
              ]);
        } else {
          auditTrail.push({
            tableName: TABLES[2].TABLE,
            id: id,
            deleted: [
              {
                Col: id,
                deletedAt: currentTimestamp,
                deletedBy: '',
              },
            ],
          });
        }
        await this.postgreSQLService.updateQuery(
          `"${TABLES[7].TABLE}"`,
          {
            [(TABLES[7].FIELDS[7] as any).DELETED]: trueRowID,
            [(TABLES[7].FIELDS[31] as any).DELETED_AT]: `'${currentTimestamp}'`,
          },
          ` "${(TABLES[7].FIELDS[1] as any).COL}" = ${id}`,
        );

        txObj.deleted.push({
          tableName: TABLES[7].TABLE,
          updated: [
            { Deleted: trueRowID },
            { 'Deleted-At': currentTimestamp },
            { Col: id },
          ],
        });

        const columnCells = await this.postgreSQLService.selectQuery({
          tables: TABLES[4].TABLE,
          fields: [`"${(TABLES[4].FIELDS[0] as any).CELL}"`],
          joins: null,
          condition: ` "${(TABLES[2].FIELDS[0] as any).COL}" = ${id}`,
        });

        if (columnCells?.length) {
          columnCellsID = columnCells.map((item) => item.Cell);

          itemCells = await this.postgreSQLService.selectQuery({
            tables: TABLES[5].TABLE,
            fields: [`"${(TABLES[5].FIELDS[0] as any).ITEM}"`],
            joins: null,
            condition: ` "${
              (TABLES[5].FIELDS[1] as any).CELL
            }" in (${columnCellsID})`,
          });

          if (itemCells?.length) {
            itemCellsID = itemCells.map((item) => item.Item);

            let inheritRow = await this.postgreSQLService.getRowByJSONDataValue(
              STATUS.INHERIT,
            );
            inheritRow = inheritRow.Row;

            //Inherited rows or Data that is reused is not to be considered so their cell, item and data are not deleted
            const dataItem = await this.postgreSQLService.selectQuery({
              tables: TABLES[6].TABLE, //t-Data
              fields: [
                `"${TABLES[6].TABLE}"."${
                  (TABLES[6].FIELDS[0] as any).DATA
                }" , "${TABLES[5].TABLE}"."${
                  (TABLES[5].FIELDS[0] as any).ITEM
                }" , "${TABLES[4].TABLE}"."${
                  (TABLES[4].FIELDS[0] as any).CELL
                }"`,
              ],
              joins: [
                [
                  `  "${TABLES[5].TABLE}" on "${TABLES[5].TABLE}"."${
                    (TABLES[5].FIELDS[2] as any).DATA
                  }" = "${TABLES[6].TABLE}"."${
                    (TABLES[6].FIELDS[0] as any).DATA
                  }" `,
                ],
                [
                  `"${TABLES[7].TABLE}" on "${TABLES[7].TABLE}"."${
                    (TABLES[7].FIELDS[11] as any).ITEM
                  }" = "${TABLES[5].TABLE}"."${
                    (TABLES[5].FIELDS[0] as any).ITEM
                  }"`,
                ],
                [
                  `"${TABLES[4].TABLE}" on "${TABLES[5].TABLE}"."${
                    (TABLES[5].FIELDS[1] as any).CELL
                  }" = "${TABLES[4].TABLE}"."${
                    (TABLES[4].FIELDS[0] as any).CELL
                  }" `,
                ],
              ],
              condition: ` "${TABLES[5].TABLE}"."${
                (TABLES[5].FIELDS[0] as any).ITEM
              }" in (${itemCellsID})
                  and NOT EXISTS (
                    SELECT 1
                    FROM "${TABLES[5].TABLE}" ${VARIABLE.ITEM_WITH_SAME_DATA}
                    join "${TABLES[7].TABLE}" on "${TABLES[7].TABLE}"."${
                      (TABLES[5].FIELDS[0] as any).ITEM
                    }" = ${VARIABLE.ITEM_WITH_SAME_DATA}."${
                      (TABLES[5].FIELDS[0] as any).ITEM
                    }"
                    WHERE ${VARIABLE.ITEM_WITH_SAME_DATA}."${
                      (TABLES[5].FIELDS[2] as any).DATA
                    }" = "${TABLES[6].TABLE}"."${
                      (TABLES[6].FIELDS[0] as any).DATA
                    }"
                    AND ${VARIABLE.ITEM_WITH_SAME_DATA}."${
                      (TABLES[5].FIELDS[0] as any).ITEM
                    }" <> "${TABLES[5].TABLE}"."${
                      (TABLES[5].FIELDS[0] as any).ITEM
                    }"
                    AND ${VARIABLE.ITEM_WITH_SAME_DATA}."${
                      (TABLES[5].FIELDS[0] as any).ITEM
                    }" IN (${itemCellsID}) and NOT (${inheritRow} = ANY("${
                      (TABLES[7].FIELDS[4] as any).STATUS
                    }"))  
                ); `,
            });

            if (dataItem?.length) {
              //delete cell, item and data which are present in the result
              cellToDelete = dataItem.map((item) => {
                return item.Cell;
              });
              dataToDelete = dataItem.map((item) => {
                return item.Data;
              });
              itemToDelete = dataItem.map((item) => {
                if (!itemToDelete.includes(item.Item)) {
                  return item.Item;
                }
              });
              // Update cell as deleted in t-Format
              currentTimestamp =
                await this.commonJSMethodService.getCurrentTimestamp();

              let updateFormatFields = {
                [(TABLES[7].FIELDS[7] as any).DELETED]: trueRowID,
                [(TABLES[7].FIELDS[31] as any).DELETED_AT]:
                  `'${currentTimestamp}'`,
              };
              await this.postgreSQLService.updateQuery(
                `"${TABLES[7].TABLE}"`,
                updateFormatFields,
                ` "${(TABLES[7].FIELDS[13] as any).CELL}" in (${cellToDelete})`,
              );

              for (let i in cellToDelete) {
                txObj.deleted.push({
                  tableName: TABLES[7].TABLE,
                  updated: [
                    { Deleted: trueRowID },
                    { 'Deleted-At': currentTimestamp },
                    { Cell: cellToDelete[i] },
                  ],
                });
              }
            }
          }
          // Update Item as deleted in t-Format
          currentTimestamp =
            await this.commonJSMethodService.getCurrentTimestamp();

          let updateFormatFields = {
            [(TABLES[7].FIELDS[7] as any).DELETED]: trueRowID,
            [(TABLES[7].FIELDS[31] as any).DELETED_AT]: `'${currentTimestamp}'`,
          };
          await this.postgreSQLService.updateQuery(
            `"${TABLES[7].TABLE}"`,
            updateFormatFields,
            ` "${(TABLES[7].FIELDS[11] as any).ITEM}" in (${itemToDelete})`,
          );

          for (let i in itemToDelete) {
            txObj.deleted.push({
              tableName: TABLES[7].TABLE,
              updated: [
                { Deleted: trueRowID },
                { 'Deleted-At': currentTimestamp },
                { Item: itemToDelete[i] },
              ],
            });
          }
          // Update Data as deleted in t-Format
          currentTimestamp =
            await this.commonJSMethodService.getCurrentTimestamp();

          updateFormatFields = {
            [(TABLES[7].FIELDS[7] as any).DELETED]: trueRowID,
            [(TABLES[7].FIELDS[31] as any).DELETED_AT]: `'${currentTimestamp}'`,
          };
          await this.postgreSQLService.updateQuery(
            `"${TABLES[7].TABLE}"`,
            updateFormatFields,
            ` "${(TABLES[7].FIELDS[16] as any).DATA}" in (${dataToDelete})`,
          );

          for (let i in dataToDelete) {
            txObj.deleted.push({
              tableName: TABLES[7].TABLE,
              updated: [
                { Deleted: trueRowID },
                { 'Deleted-At': currentTimestamp },
                { Data: dataToDelete[i] },
              ],
            });
          }
        }

        const txId = await this.entityManager.query('SELECT txid_current()');

        //insert into transaction table
        await this.postgreSQLService.insertQuery(
          `"${TABLES[8].TABLE}"`,
          `"${(TABLES[8].FIELDS[1] as any).TX_TYPE}", "${
            (TABLES[8].FIELDS[2] as any).TX_OBJECTS
          }", "${(TABLES[8].FIELDS[3] as any).TX_USER}", "${
            (TABLES[8].FIELDS[4] as any).TX_DATETIME
          }", "${(TABLES[8].FIELDS[5] as any).TX_XID}"`,
          `${body.contextMenuRow}, '${JSON.stringify(
            txObj,
          )}'::jsonb, null, CURRENT_TIMESTAMP, ${txId[0].txid_current}`,
          null,
          false,
        );

        await this.tgService.getById(columnsPG[0].PG);

        await this.entityManager.query(`END`);
      } catch (error) {
        console.log('error in trans', error);

        await this.entityManager.query('ROLLBACK');
      }

      return {
        status: 200,
        message: `${NOTIFY.SUCCESS} `,
      };
    } catch (error) {
      console.log('error main', error);

      throw new Error(`${NOTIFY.ERROR}`);
    }
  }

  async update(id, body) {
    try {
      let hiddenRowID = await this.postgreSQLService.getRowByJSONDataValue(
        STATUS.HIDDEN,
      );
      hiddenRowID = hiddenRowID.Row;
      let response = [];

      await Promise.all(
        Object.keys(body).map(async (element) => {
          const findColData = await this.postgreSQLService.getColData(element);
          if (findColData?.length > 0) {
            let statuses = findColData[0].Status.split(VARIABLE.COMMA);
            statuses = statuses.map((element) =>
              element
                .replace(VARIABLE.START_CURLEY_BRACKET, VARIABLE.EMPTY_STRING)
                .replace(VARIABLE.END_CURLEY_BRACKET, VARIABLE.EMPTY_STRING),
            );

            const date = await this.commonJSMethodService.getCurrentTimestamp();
            let updateStatus;
            let newStatus;

            if (statuses.includes(hiddenRowID)) {
              if (body[element] === true) {
                newStatus = statuses.filter(
                  (elementStatus) => elementStatus !== hiddenRowID,
                );
                updateStatus = {
                  PG: findColData[0].PG,
                  previous: false,
                  current: true,
                  updateAt: date,
                  updatedBy: '',
                };
              }
            } else {
              if (body[element] === false) {
                newStatus = [...statuses, hiddenRowID];
                updateStatus = {
                  PG: findColData[0].PG,
                  previous: true,
                  current: false,
                  updateAt: date,
                  updatedBy: VARIABLE.EMPTY_STRING,
                };
              }
            }

            let auditTrail;

            // If findColData have a field Audit-Trail
            if (findColData[0][COLUMNS.AUDIT_TRAIL]) {
              let obj;
              auditTrail = await findColData[0][COLUMNS.AUDIT_TRAIL].map(
                (element) => {
                  let response = Object.keys(element).filter(
                    (keyElement) => keyElement === OTHER_COLUMNS.HIDDEN_STATUS,
                  );
                  if (response?.length) {
                    element[OTHER_COLUMNS.HIDDEN_STATUS].push(updateStatus);
                    obj = element;
                  } else {
                    obj = {
                      ...element,
                      hiddenStatus: [updateStatus],
                    };
                  }
                  return obj;
                },
              );
            } else {
              auditTrail = [
                {
                  tableName: TABLES[2].TABLE,
                  id: findColData[0].Col,
                  updated: [updateStatus],
                },
              ];
            }

            if (newStatus?.length) {
              await this.entityManager.query('BEGIN');

              await this.postgreSQLService.updateQuery(
                `"${TABLES[7].TABLE}"`,
                {
                  [COLUMNS.STATUS]: `ARRAY[${newStatus}]`,
                  [COLUMNS.AUDIT_TRAIL]: `'${JSON.stringify(
                    auditTrail,
                  )}'::jsonb`,
                },
                `"${COLUMNS.COL}" = ${element}`,
              );

              await this.entityManager.query('COMMIT');

              await this.tgService.getById(id);
            }
            response.push(
              this.commonJSMethodService.successMessage(
                ACTIONS.EDIT.OBJECTS.EDITED,
                DDT_OBJECT[1].OBJECTS.COLUMN_NAME,
              ),
            );
          } else {
            response.push(
              this.commonJSMethodService.notFoundErrorMessage(
                ACTIONS.EDIT.OBJECTS.EDITED,
                DDT_OBJECT[1].OBJECTS.COLUMN_NAME,
              ),
            );
          }
        }),
      );
      let finalResponse = response.filter((element) => element.status === 404);
      return finalResponse?.length ? finalResponse[0] : response[0];
    } catch (error) {
      console.log({ error });
      await this.entityManager.query('ROLLBACK');
      throw error;
    }
  }

  async formatColumn(body) {
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
          `"${TABLES[6].TABLE}"`, //insert all thefont-style into a single t-Data-JSON-data
          `"${(TABLES[6].FIELDS[1] as any).DATA_TYPE}" , "${
            (TABLES[6].FIELDS[8] as any).JSON_DATA
          }"`,
          `${fontStyleRow}, '${JSON.stringify(body['Font-Style'])}'::jsonb`,
          null,
          false,
        );
      }
      let checkColFormatExists = await this.postgreSQLService.selectQuery({
        tables: TABLES[7].TABLE,
        fields: [`"${(TABLES[7].FIELDS[0] as any).FORMAT}"`],
        joins: false,
        condition: `"${(TABLES[7].FIELDS[1] as any).COL}" = ${body.Col}`,
      });

      if (!checkColFormatExists.length) {
        await this.postgreSQLService.insertQuery(
          `"${TABLES[7].TABLE}"`,
          `"${(TABLES[7].FIELDS[1] as any).COL}" ,"${
            (TABLES[7].FIELDS[3] as any).COL_MIN_WIDTH
          }" , "${(TABLES[7].FIELDS[26] as any).FONT_STYLE}" , "${
            (TABLES[7].FIELDS[28] as any).COMMENT
          }" , "${(TABLES[7].FIELDS[29] as any).AUDIT_TRAIL}" `,
          `${body.Col} , ${body['Col-Min-Width']} , '${JSON.stringify(
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
            [(TABLES[7].FIELDS[3] as any).COL_MIN_WIDTH]:
              `${body['Col-Min-Width']}`,
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
          `"${COLUMNS.COL}" = ${body.Col}`,
        );
      }

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
      throw new Error(error);
    }
  }
}
