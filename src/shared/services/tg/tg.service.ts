import { Inject, Injectable, forwardRef } from '@nestjs/common';
import {
  BOOLEAN_VALUE,
  COLUMNS,
  DATATYPE,
  MESSAGE,
  ROWS,
  Seprator,
  TABLES,
  PG_NAME,
  COLUMNS_CAPITAL,
  ID,
  VARIABLE,
  INITIAL_COLUMNS,
  OTHER_COLUMNS,
} from '../../../common/constants';
import * as fs from 'fs';
import * as path from 'path';
import { PostgreSQLService } from '../../../common/postgresql.service';
import { CommonJSMethodService } from '../../../common/commonjsMethods.service';

@Injectable()
export class TgService {
  constructor(
    @Inject(forwardRef(() => PostgreSQLService))
    private readonly postgreSQLService: PostgreSQLService,
    @Inject(forwardRef(() => CommonJSMethodService))
    private readonly commonJSMethodService: CommonJSMethodService,
  ) {}

  async getPGByID(id) {
    // let getRowID = await this.entityManager.query(`
    //     WITH RowIDData AS (
    //         SELECT
    //         "${TABLES[4].TABLE}"."Row"
    //         FROM "${TABLES[6].TABLE}"
    //         Join "${TABLES[5].TABLE}" ON "${TABLES[5].TABLE}"."Data" = "${TABLES[6].TABLE}"."Data"
    //         join "${TABLES[4].TABLE}" ON "${TABLES[4].TABLE}"."Cell" = "${TABLES[5].TABLE}"."Cell"
    //         WHERE EXISTS (
    //                 SELECT 1
    //                 FROM jsonb_each_text("JSON-Data") AS j
    //                 WHERE j.value = 'Hidden'
    //             )
    //     )

    //     Select "${TABLES[6].TABLE}"."Row-Data"
    //     from "${TABLES[6].TABLE}"
    //     join "${TABLES[5].TABLE}" on "${TABLES[5].TABLE}"."Data" = "${TABLES[6].TABLE}"."Data"
    //     join "${TABLES[4].TABLE}" as "tC" on "tC"."Cell" = "${TABLES[5].TABLE}"."Cell"
    // 	join "${TABLES[1].TABLE}" on "${TABLES[1].TABLE}"."Row" = "tC"."Row"
    //     WHERE "tC"."Row" IN (SELECT "Row" FROM RowIDData)
    // 	AND "${TABLES[6].TABLE}"."Row-Data" = "${TABLES[1].TABLE}"."Row"
    // `)

    /**
     * START:- Get Col
     */
    let falseRowID = await this.postgreSQLService.getRowByJSONDataValue(
      BOOLEAN_VALUE.FALSE_CAPS,
    );
    falseRowID = falseRowID.Row;

    const getCol = await this.postgreSQLService.selectQuery({
      tables: TABLES[2].TABLE,
      fields: [
        `"${TABLES[2].TABLE}".${VARIABLE.STAR}`,
        `"${TABLES[7].TABLE}".${VARIABLE.STAR}`,
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
      }" = ${id} 
       and "${(TABLES[7].FIELDS[7] as any).DELETED}" = ${falseRowID} and "${
         (TABLES[7].FIELDS[31] as any).DELETED_AT
       }" is null `,
    });

    /**
     * END:- Get Col
     */

    /**
     * START:- Get Data
     */
    let getData = await this.postgreSQLService.selectQuery({
      tables: TABLES[6].TABLE,
      fields: [
        `"${TABLES[1].TABLE}"."${TABLES[1].FIELDS[1][COLUMNS_CAPITAL.PG]}"`,
        `"${TABLES[4].TABLE}"."${TABLES[4].FIELDS[1][COLUMNS_CAPITAL.ROW]}"`,
        `"${TABLES[1].TABLE}"."${
          TABLES[1].FIELDS[4][COLUMNS_CAPITAL.PARENT_ROW]
        }"`,
        `"${TABLES[1].TABLE}"."${
          TABLES[1].FIELDS[3][COLUMNS_CAPITAL.ROW_LEVEL]
        }"`,
        `"${TABLES[4].TABLE}"."${TABLES[4].FIELDS[2][COLUMNS_CAPITAL.COL]}"`,
        `"${TABLES[2].TABLE}"."${
          TABLES[2].FIELDS[2][COLUMNS_CAPITAL.COL_NAME]
        }"`,
        `"${TABLES[6].TABLE}".*`,
        `"${TABLES[5].TABLE}"."${TABLES[5].FIELDS[0][COLUMNS_CAPITAL.ITEM]}"`,
      ],
      joins: [
        [
          `"${TABLES[5].TABLE}" ON "${TABLES[5].TABLE}"."${
            TABLES[5].FIELDS[2][COLUMNS_CAPITAL.DATA]
          }" = "${TABLES[6].TABLE}"."${
            TABLES[6].FIELDS[0][COLUMNS_CAPITAL.DATA]
          }"`,
        ],
        [
          `"${TABLES[4].TABLE}" ON "${TABLES[4].TABLE}"."${
            TABLES[4].FIELDS[0][COLUMNS_CAPITAL.CELL]
          }" = "${TABLES[5].TABLE}"."${
            TABLES[5].FIELDS[1][COLUMNS_CAPITAL.CELL]
          }"`,
        ],
        [
          `"${TABLES[2].TABLE}" ON "${TABLES[2].TABLE}"."${
            TABLES[2].FIELDS[0][COLUMNS_CAPITAL.COL]
          }" = "${TABLES[4].TABLE}"."${
            TABLES[4].FIELDS[2][COLUMNS_CAPITAL.COL]
          }"`,
        ],
        [
          `"${TABLES[1].TABLE}" ON "${TABLES[1].TABLE}"."${
            TABLES[1].FIELDS[0][COLUMNS_CAPITAL.ROW]
          }" = "${TABLES[4].TABLE}"."${
            TABLES[4].FIELDS[1][COLUMNS_CAPITAL.ROW]
          }"`,
        ],
      ],
      condition: `"${TABLES[2].TABLE}"."${
        TABLES[2].FIELDS[1][COLUMNS_CAPITAL.PG]
      }" = ${id}`,
    });
    /**
     * END:- Get Data
     */

    /**
     * START:- Get Format Data
     */
    let getFormatData = await this.postgreSQLService.selectQuery({
      tables: TABLES[7].TABLE,
      fields: [
        `"${TABLES[7].FIELDS[8][COLUMNS_CAPITAL.PG]}"`,
        `"${TABLES[7].FIELDS[9][COLUMNS_CAPITAL.PG_NESTED_COL]}"`,
        `"${TABLES[7].FIELDS[17][COLUMNS_CAPITAL.PG_FREEZE_COL]}"`,
        `"${TABLES[7].FIELDS[10][COLUMNS_CAPITAL.PG_EXPAND]}"`,
        `"${TABLES[7].FIELDS[18][COLUMNS_CAPITAL.PG_LEVEL_SET]}"`,
        `"${TABLES[7].FIELDS[19][COLUMNS_CAPITAL.PG_SEARCH_SET]}"`,
        `"${TABLES[7].FIELDS[20][COLUMNS_CAPITAL.PG_SORT]}"`,
        `"${TABLES[7].FIELDS[21][COLUMNS_CAPITAL.PG_FILTER]}"`,
        `"${TABLES[7].FIELDS[28][COLUMNS_CAPITAL.COMMENT]}"`,
        `"${TABLES[7].FIELDS[29][COLUMNS_CAPITAL.AUDIT_TRAIL]}"`,
      ],
      joins: [], // Add joins if needed
      condition: `"${TABLES[7].FIELDS[8][COLUMNS_CAPITAL.PG]}" = ${id}`,
    });
    /**
     * END:- Get Item Data
     */

    /**
     * START:- Get Item Data
     */
    let getItemData = await this.postgreSQLService.selectQuery({
      tables: TABLES[6].TABLE,
      fields: [
        `"${TABLES[5].TABLE}"."${TABLES[5].FIELDS[0][COLUMNS_CAPITAL.ITEM]}"`,
        `"${TABLES[2].TABLE}"."${
          TABLES[2].FIELDS[2][COLUMNS_CAPITAL.COL_NAME]
        }"`,
        `"${TABLES[2].TABLE}"."${
          TABLES[2].FIELDS[3][COLUMNS_CAPITAL.DATA_TYPE]
        }"`,
        `"${TABLES[6].TABLE}".${VARIABLE.STAR}`,
        `"${TABLES[7].TABLE}"."${TABLES[7].FIELDS[11][COLUMNS_CAPITAL.ITEM]}"`,
        `"${TABLES[7].TABLE}"."${
          TABLES[7].FIELDS[12][COLUMNS_CAPITAL.ITEM_ORDER]
        }"`,
        `"${TABLES[7].TABLE}"."${TABLES[7].FIELDS[4][COLUMNS_CAPITAL.STATUS]}"`,
        `"${TABLES[7].TABLE}"."${TABLES[7].FIELDS[25][COLUMNS_CAPITAL.UNIT]}"`,
        `"${TABLES[7].TABLE}"."${
          TABLES[7].FIELDS[26][COLUMNS_CAPITAL.FONT_STYLE]
        }"`,
        `"${TABLES[7].TABLE}"."${
          TABLES[7].FIELDS[32][COLUMNS_CAPITAL.FORMULA]
        }"`,
        `"${TABLES[7].TABLE}"."${
          TABLES[7].FIELDS[28][COLUMNS_CAPITAL.COMMENT]
        }"`,
        `"${TABLES[7].TABLE}"."${
          TABLES[7].FIELDS[29][COLUMNS_CAPITAL.AUDIT_TRAIL]
        }"`,
        `"${TABLES[1].TABLE}"."${(TABLES[1].FIELDS[0] as any).ROW}"`,
      ],
      joins: [
        [
          `"${TABLES[5].TABLE}" ON "${TABLES[5].TABLE}"."${
            TABLES[5].FIELDS[2][COLUMNS_CAPITAL.DATA]
          }" = "${TABLES[6].TABLE}"."${
            TABLES[6].FIELDS[0][COLUMNS_CAPITAL.DATA]
          }"`,
        ],
        [
          `"${TABLES[4].TABLE}" ON "${TABLES[4].TABLE}"."${
            TABLES[4].FIELDS[0][COLUMNS_CAPITAL.CELL]
          }" = "${TABLES[5].TABLE}"."${
            TABLES[5].FIELDS[1][COLUMNS_CAPITAL.CELL]
          }"`,
        ],
        [
          `"${TABLES[2].TABLE}" ON "${TABLES[2].TABLE}"."${
            TABLES[2].FIELDS[0][COLUMNS_CAPITAL.COL]
          }" = "${TABLES[4].TABLE}"."${
            TABLES[4].FIELDS[2][COLUMNS_CAPITAL.COL]
          }"`,
        ],
        [
          `"${TABLES[1].TABLE}" ON "${TABLES[1].TABLE}"."${
            TABLES[1].FIELDS[0][COLUMNS_CAPITAL.ROW]
          }" = "${TABLES[4].TABLE}"."${
            TABLES[4].FIELDS[1][COLUMNS_CAPITAL.ROW]
          }"`,
        ],
        [
          `"${TABLES[7].TABLE}" ON "${TABLES[7].TABLE}"."${
            TABLES[7].FIELDS[11][COLUMNS_CAPITAL.ITEM]
          }" = "${TABLES[5].TABLE}"."${
            TABLES[5].FIELDS[0][COLUMNS_CAPITAL.ITEM]
          }"`,
        ],
      ],
      condition: `"${TABLES[2].TABLE}"."${
        TABLES[2].FIELDS[1][COLUMNS_CAPITAL.PG]
      }" = ${id}`,
    });

    /**
     * END:- Get Item Data
     */

    /**
     * Start: PG Format Object
     */
    let updateFormatObj = await Promise.all(
      getFormatData.map(async (element) => {
        let columnName = await getCol.filter((elementValue) => {
          return elementValue.Col === element[COLUMNS.PG_HIERARCHY_COL];
        })[0][COLUMNS.COL_NAME];

        return {
          ...element,
          [COLUMNS.PG_HIERARCHY_COL]: Object.values(columnName)[0],
        };
      }),
    );
    /**
     * END
     */

    /**
     * Start
     * Store Column data in updateColObj
     */
    // let rowID = await getRowID.map(element => Object.values(element)[0])

    // getCol = await getCol.filter(element => rowID.some(id => element.Status.indexOf(id) > -1) === false)

    let updateColObj = await Promise.all(
      getCol.map(async (elementValue) => {
        try {
          // Filtering which column is hierarchy Col
          let isHeirarchy = await getFormatData.filter(
            (value) =>
              value[COLUMNS.PG_HIERARCHY_COL] === elementValue[COLUMNS.COL],
          );

          // Filtering which column is Initial Col
          let isInitial = INITIAL_COLUMNS.includes(
            Object.values(elementValue[COLUMNS.COL_NAME])[0],
          );

          isHeirarchy = isHeirarchy?.length ? true : false;

          let isFreeze = await getFormatData.filter(
            (value) =>
              value[COLUMNS.PG_FREEZE_COL] === elementValue[COLUMNS.COL],
          );

          isFreeze = isFreeze?.length ? true : false;
          let colStatus = await this.commonJSMethodService.findDataNameByRowIDs(
            this.postgreSQLService,
            elementValue[COLUMNS.STATUS],
          );

          let colName = await this.findColName(elementValue[COLUMNS.COL]);

          let dataTypeRowID =
            await this.commonJSMethodService.findDataNameByRowIDs(
              this.postgreSQLService,
              elementValue[COLUMNS.DATA_TYPE],
            );

          let ddtSourceRowID = elementValue[COLUMNS.DDT_SOURCE]
            ? await this.commonJSMethodService.findDataNameByRowIDs(
                this.postgreSQLService,
                elementValue[COLUMNS.DDT_SOURCE],
              )
            : null;

          let defaultData = null;
          if (elementValue[COLUMNS.DEFAULT]) {
            switch (dataTypeRowID) {
              case DATATYPE.ROW_ID:
              case DATATYPE.USER_ID:
              case DATATYPE.DDT:
                // Code for t-Data.Row-Data
                defaultData = await this.findDefaultDataByCellID(
                  TABLES[6].FIELDS[2][COLUMNS_CAPITAL.ROW_DATA],
                  elementValue[COLUMNS.DEFAULT],
                );
                break;

              case DATATYPE.DATETIME:
                // Code for t-Data.DateTime-Data
                defaultData = await this.findDefaultDataByCellID(
                  TABLES[6].FIELDS[3][COLUMNS_CAPITAL.DATETIME_DATA],
                  elementValue[COLUMNS.DEFAULT],
                );
                break;

              case DATATYPE.COLOR:
                // Code for Color-Data
                defaultData = await this.findDefaultDataByCellID(
                  TABLES[6].FIELDS[4][COLUMNS_CAPITAL.COLOR_DATA],
                  elementValue[COLUMNS.DEFAULT],
                );
                break;

              case DATATYPE.INT:
                // Code for Int-Data
                defaultData = await this.findDefaultDataByCellID(
                  TABLES[6].FIELDS[5][COLUMNS_CAPITAL.INT_DATA],
                  elementValue[COLUMNS.DEFAULT],
                );
                break;

              case DATATYPE.BIGINT:
              case DATATYPE.PGID:
              case DATATYPE.CATEGORY_ID:
              case DATATYPE.SEARCH_SET_ID:
                // Code for BigInt-Data
                defaultData = await this.findDefaultDataByCellID(
                  TABLES[6].FIELDS[6][COLUMNS_CAPITAL.BIGINT_DATA],
                  elementValue[COLUMNS.DEFAULT],
                );
                break;

              case DATATYPE.NUM:
              case DATATYPE.PERCENTAGE:
                // code for num-Data
                defaultData = await this.findDefaultDataByCellID(
                  TABLES[6].FIELDS[7][COLUMNS_CAPITAL.NUM_DATA],
                  elementValue[COLUMNS.DEFAULT],
                );
                break;

              case DATATYPE.UNIT:
                // code for num-Data
                defaultData = await this.findDefaultDataByCellID(
                  TABLES[6].FIELDS[10][COLUMNS_CAPITAL.UNIT_DATA],
                  elementValue[COLUMNS.DEFAULT],
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
                defaultData = await this.findDefaultDataByCellID(
                  TABLES[6].FIELDS[8][COLUMNS_CAPITAL.JSON_DATA],
                  elementValue[COLUMNS.DEFAULT],
                );
                break;
            }
          }

          let Cols = {
            colID: elementValue[COLUMNS.COL],
            title: Object.values(elementValue[COLUMNS.COL_NAME])[0],
            colOrder: elementValue[COLUMNS.COL_ORDER],
            colName: [colName[0][COLUMNS.COL_NAME]],
            colDataType: dataTypeRowID,
            colDDTsource: ddtSourceRowID,
            colDefaultData: defaultData,
            colMinWidth: elementValue[COLUMNS.COL_MIN_WIDTH],
            colFontStyle: elementValue[COLUMNS.FONT_STYLE],
            comment: elementValue[COLUMNS.COMMENT],
            auditTrail: elementValue[COLUMNS.AUDIT_TRAIL],
            calcFormula: !elementValue[COLUMNS.FORMULA]
              ? elementValue[COLUMNS.FORMULA]
              : [elementValue[COLUMNS.FORMULA]],
            colStatus: colStatus,
            isHeirarchy: isHeirarchy,
            isFreeze: isFreeze,
            isInitial: isInitial,
          };

          return Cols;
        } catch (error) {
          return error;
        }
      }),
    );
    /**
     * End
     */

    /**
     * Start
     * Store Data of Column in varaible
     */

    const groupedData = getData.reduce((acc, obj) => {
      const key = obj[COLUMNS.ROW];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});

    let filterResult = [];
    for (let i in groupedData) {
      let object = {};
      let status = [];
      let jsonData = [];
      for (let j in groupedData[i]) {
        let result = getCol.filter(
          (element) =>
            Object.values(element[COLUMNS.COL_NAME])[0] ===
            Object.values(groupedData[i][j][COLUMNS.COL_NAME])[0],
        );
        if (result?.length) {
          let key: any = Object.values(groupedData[i][j][COLUMNS.COL_NAME])[0];
          switch (key) {
            case ROWS.ROW:
            case ROWS.ROWID:
            case ROWS.SHARE:
              object[ROWS.PARENT_ROW] = [
                {
                  value: groupedData[i][j][ROWS.PARENT_ROW],
                },
              ];
              object[ROWS.ROW_LEVEL] = [
                {
                  value: groupedData[i][j][ROWS.ROW_LEVEL],
                },
              ];
              object[key] = [
                {
                  value: groupedData[i][j][ROWS.ROW_DATA],
                  item: groupedData[i][j][COLUMNS.ITEM],
                },
              ];
              break;

            case ROWS.PGID:
              object[key] = [
                {
                  value: groupedData[i][j][COLUMNS.BIGINT_DATA],
                  item: groupedData[i][j][COLUMNS.ITEM],
                },
              ];
              break;

            case ROWS.UNIT_FACTOR:
              object[key] = [
                {
                  value: groupedData[i][j][COLUMNS.NUM_DATA],
                  item: groupedData[i][j][COLUMNS.ITEM],
                },
              ];
              break;

            case ROWS.PG_NAME:
            case ROWS.PG_URL:
            case ROWS.PG_COMMENT:
            case ROWS.ROW_AUDIT_TRAIL:
            case ROWS.DDT_DATA:
            case ROWS.LABEL_DATA:
            case ROWS.VALUE_DEFAULT:
            case ROWS.VALUE_DEFAULT_DATA:
            case ROWS.UNIT_DATA:
              if (groupedData[i][j][COLUMNS.JSON_DATA]) {
                object[key] = [
                  {
                    value: Object.values(
                      groupedData[i][j][COLUMNS.JSON_DATA],
                    )[0],
                    item: groupedData[i][j][COLUMNS.ITEM],
                  },
                ];
              }
              break;

            case ROWS.PG_TYPE:
            case ROWS.PG_EDITION:
            case ROWS.PG_OWNER:
            case ROWS.ROW_TYPE:
            case ROWS.ROW_STATUS:
            case ROWS.VALUE_TYPE:
            case ROWS.VALUE_DATA_TYPE:
            case ROWS.DDT_SOURCE:
            case ROWS.VALUE_DDT_SOURCE:
            case ROWS.DDT_DEFAULT:
            case ROWS.VALUE_DEFAULT_DATA:
              let tgStatusRowID =
                await this.commonJSMethodService.findDataNameByRowIDs(
                  this.postgreSQLService,
                  groupedData[i][j][ROWS.ROW_DATA],
                );
              object[key] = [
                {
                  value: tgStatusRowID,
                  item: groupedData[i][j][COLUMNS.ITEM],
                },
              ];
              break;

            case ROWS.PG_SEO:
            case ROWS.ROW_COMMENT:
              jsonData.push({
                value: Object.values(groupedData[i][j][COLUMNS.JSON_DATA])[0],
                item: groupedData[i][j][COLUMNS.ITEM],
              });

              object[key] = jsonData.map((element) => {
                return {
                  value: element.value,
                  item: element.item,
                };
              });
              break;

            case ROWS.PG_STATUS:
            case ROWS.VALUE_FORMAT:
            case ROWS.VALUE_STATUS:
              let tgStatusRowIDs =
                await this.commonJSMethodService.findDataNameByRowIDs(
                  this.postgreSQLService,
                  groupedData[i][j][ROWS.ROW_DATA],
                );

              status.push({
                tgStatus: tgStatusRowIDs,
                item: groupedData[i][j][COLUMNS.ITEM],
              });

              object[key] = status.map((element) => {
                return {
                  value: element.tgStatus,
                  item: element.item,
                };
              });
              break;
          }
        }
      }
      filterResult.push(object);
    }

    // Filter out blank objects
    filterResult = filterResult.filter((item) => Object.keys(item).length > 0);

    /**
     * Add Item's formatting in response
     */
    let itemFormatArray = [];

    for (let item in getItemData) {
      let itemName;
      let colDataType = await this.commonJSMethodService.findDataNameByRowIDs(
        this.postgreSQLService,
        getItemData[item][COLUMNS.DATA_TYPE],
      );
      getItemData[item][COLUMNS.DATA_TYPE] = colDataType;

      switch (getItemData[item][COLUMNS.DATA_TYPE]) {
        case DATATYPE.PGID:
          itemName = getItemData[item][COLUMNS.BIGINT_DATA];
          break;
        case DATATYPE.PG_TYPES:
        case DATATYPE.EDITIONS:
        case DATATYPE.USER_ID:
        case DATATYPE.STATUSES:
        case DATATYPE.ROW_TYPES:
        case DATATYPE.ROW_ID:
        case DATATYPE.DDT:
        case DATATYPE.DATA_TYPES:
          if (
            [ROWS.ROW, ROWS.ROWID, ROWS.SHARE].includes(
              String(Object.values(getItemData[item][COLUMNS.COL_NAME])[0]),
            )
          ) {
            itemName = getItemData[item][ROWS.ROW_DATA];
            break;
          } else {
            itemName = await this.commonJSMethodService.findDataNameByRowIDs(
              this.postgreSQLService,
              getItemData[item][ROWS.ROW_DATA],
            );
            break;
          }

        case DATATYPE.URL:
        case DATATYPE.ML_TEXT:
        case DATATYPE.FORMULA:
        case DATATYPE.VALUE_TYPE:
          itemName = Object.values(getItemData[item][COLUMNS.JSON_DATA])[0];
          break;
      }

      itemFormatArray.push({
        item: getItemData[item][COLUMNS.ITEM],
        colName: Object.values(getItemData[item][COLUMNS.COL_NAME])[0],
        itemName: itemName,
        itemOrder: getItemData[item][COLUMNS.ITEM_ORDER],
        itemStatus: getItemData[item].Status,
        itemUnit: getItemData[item].Unit,
        itemLanguage: getItemData[item].Language,
        itemFontStyle: getItemData[item][COLUMNS.FONT_STYLE],
        itemCalculated: getItemData[item].Calculated,
        itemDataFormula: getItemData[item][COLUMNS.DATA_FORMULA],
        itemComment: getItemData[item].Comment,
        itemAuditTrail: getItemData[item][COLUMNS.AUDIT_TRAIL],
        row: getItemData[item][COLUMNS.ROW],
      });
    }

    /**
     * Start:- Adding itemFormat response with its itemId
     */
    itemFormatArray = filterResult.map((element) => {
      let obj = {};
      for (let elementValue in element) {
        obj[elementValue] = Object.values(element[elementValue]).map(
          (filterValue) => {
            let filterItem = itemFormatArray.find(
              (col) => col.item === filterValue[COLUMNS.item],
            );
            return {
              value: filterValue[COLUMNS.VALUE],
              itemFormat: filterItem,
            };
          },
        );
      }
      obj[COLUMNS._CHILDREN] = [];
      return obj;
    });
    // Filter the object who has a property "Row*"
    itemFormatArray = itemFormatArray.filter((obj) =>
      obj.hasOwnProperty(ROWS.ROW),
    );
    /**
     * END:- Adding itemFormat response with its itemId
     */

    /**
     * END
     */

    // Create a map to efficiently look up items by RowID
    const dataMap = new Map();
    for (const item of itemFormatArray) {
      const rowID = item[ROWS.ROW][0][COLUMNS.VALUE];
      dataMap.set(rowID, item);
    }

    // Iterate through the array to link children to their respective parents
    for (const item of itemFormatArray) {
      const parentRowID = item[ROWS.PARENT_ROW][0][COLUMNS.VALUE];
      if (parentRowID !== null) {
        const parentItem = dataMap.get(parentRowID);
        if (parentItem) {
          parentItem._children.push(item);
        }
      }
    }

    // Find the root node(s) (those with no parent) to construct the final array
    const roots = itemFormatArray.filter(
      (item) => item[ROWS.PARENT_ROW][0][COLUMNS.VALUE] === null,
    );

    // Convert the roots to the desired output format, excluding "Parent-Row"
    let outputArray = roots.map((root) => {
      const { [ROWS.PARENT_ROW]: parentRow, ...rest } = root;
      return { ...rest, _children: root._children };
    });

    // Remove "Parent-Row" property from each object in the array and its nested objects
    const removeParentRow = (obj) => {
      const newObj = { ...obj };
      delete newObj[ROWS.PARENT_ROW];

      if (obj._children) {
        newObj._children = obj._children.map(removeParentRow);
      }
      return newObj;
    };

    // Updated array without "Parent-Row" property
    outputArray = outputArray.map(removeParentRow);

    //Get Format of Local Rows in the PG
    let getRowFormat = await this.postgreSQLService.selectQuery({
      tables: TABLES[7].TABLE,
      fields: [
        `"${(TABLES[7].FIELDS[0] as any).FORMAT}"`,
        `"${TABLES[7].TABLE}"."${(TABLES[7].FIELDS[22] as any).ROW}"`,
        `"${TABLES[7].TABLE}"."${(TABLES[7].FIELDS[4] as any).STATUS}"`,
        `"${TABLES[1].TABLE}"."${(TABLES[1].FIELDS[8] as any).ROW_TYPE}"`,
        `"${TABLES[7].TABLE}"."${(TABLES[7].FIELDS[26] as any).FONT_STYLE}"`,
        `"${TABLES[7].TABLE}"."${(TABLES[7].FIELDS[28] as any).COMMENT}"`,
        `"${TABLES[7].TABLE}"."${(TABLES[7].FIELDS[29] as any).AUDIT_TRAIL}"`,
      ],
      joins: [
        [
          `"${TABLES[1].TABLE}" on "${TABLES[1].TABLE}"."${
            (TABLES[1].FIELDS[0] as any).ROW
          }" =  "${TABLES[7].TABLE}"."${(TABLES[7].FIELDS[22] as any).ROW}"`,
        ],
      ], // Add joins if needed
      condition: `"${TABLES[7].TABLE}"."${
        (TABLES[7].FIELDS[22] as any).ROW
      }" in (select "${(TABLES[1].FIELDS[0] as any).ROW}" from "${
        TABLES[1].TABLE
      }" where "${(TABLES[7].FIELDS[8] as any).PG}"=${id})`,
    });

    //Get Format of Local Rows in the PG
    let getShareRowFormat = await this.postgreSQLService.selectQuery({
      tables: TABLES[7].TABLE,
      fields: [
        `"${(TABLES[7].FIELDS[0] as any).FORMAT}"`,
        `"${TABLES[1].TABLE}"."${(TABLES[1].FIELDS[1] as any).PG}"`,
        `"${TABLES[7].TABLE}"."${(TABLES[7].FIELDS[24] as any).SHARE}"`,
        `"${TABLES[7].TABLE}"."${(TABLES[7].FIELDS[4] as any).STATUS}"`,
        `"${TABLES[1].TABLE}"."${(TABLES[1].FIELDS[8] as any).ROW_TYPE}"`,
        `"${TABLES[7].TABLE}"."${(TABLES[7].FIELDS[26] as any).FONT_STYLE}"`,
        `"${TABLES[7].TABLE}"."${(TABLES[7].FIELDS[28] as any).COMMENT}"`,
        `"${TABLES[7].TABLE}"."${(TABLES[7].FIELDS[29] as any).AUDIT_TRAIL}"`,
      ],
      joins: [
        [
          `"${TABLES[3].TABLE}" on "${TABLES[3].TABLE}"."${
            (TABLES[3].FIELDS[0] as any).SHARE
          }" =  "${TABLES[7].TABLE}"."${(TABLES[7].FIELDS[24] as any).SHARE}"`,
        ],
        [
          `"${TABLES[1].TABLE}" on "${TABLES[1].TABLE}"."${
            (TABLES[1].FIELDS[6] as any).SHARE
          }" =  "${TABLES[3].TABLE}"."${(TABLES[3].FIELDS[0] as any).SHARE}"`,
        ],
      ], // Add joins if needed
      condition: `"${TABLES[7].TABLE}"."${
        (TABLES[7].FIELDS[24] as any).SHARE
      }" in (select "${(TABLES[1].FIELDS[6] as any).SHARE}" from "${
        TABLES[1].TABLE
      }" where "${(TABLES[7].FIELDS[8] as any).PG}"=${id})`,
    });

    let sharedPGs = getShareRowFormat.map((element) => element.PG);
    let finalSharedResult = [];

    for (let sharedPGsElement of sharedPGs) {
      const sharedResults = filterResult.filter((element) => {
        return (
          element[ROWS.PGID]?.length &&
          element[ROWS.PGID][0].value == sharedPGsElement
        );
      });

      // Concatenate the results to the finalSharedResult array
      finalSharedResult = finalSharedResult.concat({
        [COLUMNS.PGID]: sharedResults[0][ROWS.PGID][0].value,
        [COLUMNS.PG_NAME]: sharedResults[0][ROWS.PG_NAME][0].value,
      });
    }

    getShareRowFormat.forEach((obj) => {
      // Remove the 'PG' property from each object
      delete obj.PG;

      obj[OTHER_COLUMNS.SHARED_PG] = finalSharedResult;
    });
    /**
     * END
     */

    let finalResult = [
      {
        tgFormat: updateFormatObj,
        rowFormat: getRowFormat,
        shareRowFormat: getShareRowFormat,
        columns: updateColObj,
        columnData: outputArray,
      },
    ];
    await this.jsonFileCreation(id, finalResult[0]);
    return finalResult;
  }

  async getById(id: number): Promise<any> {
    try {
      const result = await this.getPGByID(id);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getAll(): Promise<any> {
    try {
      let rowIDDataForWith = 'RowIDData';
      let getPGID = await this.postgreSQLService.SelectQueryWith(
        `"${TABLES[1].TABLE}"."${TABLES[1].FIELDS[0][COLUMNS_CAPITAL.ROW]}"`,
        `"${TABLES[6].TABLE}"`,
        `Join "${TABLES[5].TABLE}" ON "${TABLES[5].TABLE}"."${
          TABLES[5].FIELDS[2][COLUMNS_CAPITAL.DATA]
        }" = "${TABLES[6].TABLE}"."${TABLES[6].FIELDS[0][COLUMNS_CAPITAL.DATA]}"
              join "${TABLES[4].TABLE}" ON "${TABLES[4].TABLE}"."${
                TABLES[4].FIELDS[0][COLUMNS_CAPITAL.CELL]
              }" = "${TABLES[5].TABLE}"."${
                TABLES[5].FIELDS[1][COLUMNS_CAPITAL.CELL]
              }"
			        join "${TABLES[1].TABLE}" ON "${TABLES[1].TABLE}"."${
                TABLES[1].FIELDS[0][COLUMNS_CAPITAL.ROW]
              }" = "${TABLES[4].TABLE}"."${
                TABLES[4].FIELDS[1][COLUMNS_CAPITAL.ROW]
              }"`,
        `WHERE EXISTS (
                      SELECT 1
                      FROM jsonb_each_text("${
                        TABLES[6].FIELDS[8][COLUMNS_CAPITAL.JSON_DATA]
                      }") AS j
                      WHERE j.value = '${PG_NAME.ALL_DDT}'
                  )
			        limit 1`,
        `"${TABLES[6].TABLE}"."${
          TABLES[6].FIELDS[6][COLUMNS_CAPITAL.BIGINT_DATA]
        }"`,
        `"${TABLES[6].TABLE}"`,
        ` join "${TABLES[5].TABLE}" on "${TABLES[5].TABLE}"."${
          TABLES[5].FIELDS[2][COLUMNS_CAPITAL.DATA]
        }" = "${TABLES[6].TABLE}"."${TABLES[6].FIELDS[0][COLUMNS_CAPITAL.DATA]}"
              join "${TABLES[4].TABLE}" as "tC" on "tC"."${
                TABLES[4].FIELDS[0][COLUMNS_CAPITAL.CELL]
              }" = "${TABLES[5].TABLE}"."${
                TABLES[5].FIELDS[1][COLUMNS_CAPITAL.CELL]
              }"
              join "${TABLES[1].TABLE}" on "${TABLES[1].TABLE}"."${
                TABLES[1].FIELDS[0][COLUMNS_CAPITAL.ROW]
              }" = "tC"."${TABLES[4].FIELDS[1][COLUMNS_CAPITAL.ROW]}"`,
        `WHERE "tC"."${TABLES[4].FIELDS[1][COLUMNS_CAPITAL.ROW]}" IN (SELECT "${
          COLUMNS.ROW
        }" FROM ${rowIDDataForWith})
              AND "${TABLES[6].TABLE}"."${
                TABLES[6].FIELDS[6][COLUMNS_CAPITAL.BIGINT_DATA]
              }" IS NOT NULL`,
        rowIDDataForWith,
      );
      getPGID = getPGID[0][COLUMNS.BIGINT_DATA];

      const result = await this.getPGByID(getPGID);

      await this.jsonFileCreation(ID.ALL_DDT_ID, result);

      return MESSAGE.JSON_FILE_CREATED;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async findColName(colID): Promise<any> {
    try {
      let getColID = await this.postgreSQLService.selectQuery({
        tables: TABLES[2].TABLE,
        fields: [`"${TABLES[2].FIELDS[2][COLUMNS_CAPITAL.COL_NAME]}"`],
        joins: [],
        condition: `"${TABLES[2].FIELDS[0][COLUMNS_CAPITAL.COL]}" = ${colID}`,
      });

      return getColID;
    } catch (error) {
      throw error;
    }
  }

  async findDefaultDataByCellID(field, cellId) {
    return await this.commonJSMethodService.findDefaultData(
      this.postgreSQLService,
      field,
      cellId,
    );
  }

  // JSON file will create
  async jsonFileCreation(fileName, result) {
    try {
      const basePath = '../backend/';
      const folderName = 'public';

      // Check if the public folder exists
      const folderPath = path.join(basePath, folderName);

      if (!fs.existsSync(folderPath)) {
        // If the public folder doesn't exist, create it
        fs.mkdirSync(folderPath);
      }

      // Convert the JSON object to a string
      const jsonString = JSON.stringify(result, null, 2); // Adds indentation for readability

      // Specify the file path where you want to save the JSON file
      fileName = fileName + '.json';
      const jsonFilePath = path.join(folderPath, fileName); // Use the appropriate pathss

      // Check if the file exists, and delete it if it does.
      try {
        await fs.unlinkSync(jsonFilePath);
      } catch (error) {
        // Ignore errors if the file doesn't exist
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }

      // Write the new JSON string to the file
      await fs.writeFileSync(jsonFilePath, jsonString);

      return true;
    } catch (error) {
      console.log('Error::::', error);
      throw new error();
    }
  }
}
