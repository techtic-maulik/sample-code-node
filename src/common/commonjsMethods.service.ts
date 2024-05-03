import {
  COLUMNS,
  COLUMNS_CAPITAL,
  MANDATORY_COLUMNS,
  MESSAGE,
  NOTIFY,
  OTHERS,
  Seprator,
  TABLES,
  VARIABLE,
} from './constants';

export class CommonJSMethodService {
  async filterArray(array, condition1, condition2): Promise<any> {
    return array.filter((item) => {
      return item[condition1] == condition2;
    });
  }

  messageGenerator(statusCode, notify, action, reason, fromText, toText) {
    return {
      status: statusCode,
      message: `${notify} ` + `${action} ` + reason.replace(fromText, toText),
    };
  }

  notFoundErrorMessage(action, toText) {
    return this.messageGenerator(
      404,
      NOTIFY.ERROR,
      action,
      MESSAGE.WAS_NOT_FOUND,
      OTHERS.OBJECT,
      toText,
    );
  }

  successMessage(action, toText) {
    return this.messageGenerator(
      200,
      NOTIFY.SUCCESS,
      action,
      MESSAGE.HAS_BEEN_ACTIONED,
      OTHERS.ACTIONED,
      toText,
    );
  }

  duplicateErrorMessage(action, toText) {
    return this.messageGenerator(
      422,
      NOTIFY.ALERT,
      action,
      MESSAGE.DUPLICATE_COLUMN_NAME,
      OTHERS.OBJECT,
      toText,
    );
  }
  async getCurrentTimestamp() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  areAllValuesSame(obj) {
    const values = Object.values(obj);
    return values.every((value) => value === values[0]);
  }

  async checkMandatoryColumns(action, toText, service, field, colName) {
    // check mandatory column
    const errorMessage = this.duplicateErrorMessage(action, toText);

    let colObj = {};
    const mandatoryColumn = await Promise.all(
      Object.values(MANDATORY_COLUMNS).map(async (element) => {
        let columnsRow = await service.getRowByJSONDataValue(element);
        return columnsRow.Row;
      }),
    );

    let isMadndaotry = false;
    for (let mandatoryElement of mandatoryColumn) {
      let filterMandatory = field.filter((value) => value === mandatoryElement);
      if (filterMandatory?.length) {
        isMadndaotry = true;
      }
    }

    for (let element in Object.values(colName)) {
      let mandatoryColName = Object.values(colName)[element];
      if (isMadndaotry === true) {
        mandatoryColName = Object.values(colName)[element] + VARIABLE.STAR;
      }
      let colObjKey = Object.keys(colName)[element];

      colObj[colObjKey] = mandatoryColName;
    }
    return colObj;
  }

  async findDataNameByRowIDUsingQuery(service, rowData) {
    let rowID = await service.selectQuery({
      tables: TABLES[4].TABLE,
      fields: [
        `"${TABLES[6].TABLE}"."${
          TABLES[6].FIELDS[8][COLUMNS_CAPITAL.JSON_DATA]
        }"`,
      ],
      joins: [
        [
          `"${TABLES[2].TABLE}" ON "${TABLES[2].TABLE}"."${
            TABLES[2].FIELDS[0][COLUMNS_CAPITAL.COL]
          }" = "${TABLES[4].TABLE}"."${
            TABLES[4].FIELDS[2][COLUMNS_CAPITAL.COL]
          }"`,
        ],
        [
          `"${TABLES[5].TABLE}" ON "${TABLES[5].TABLE}"."${
            TABLES[5].FIELDS[1][COLUMNS_CAPITAL.CELL]
          }" = "${TABLES[4].TABLE}"."${
            TABLES[4].FIELDS[0][COLUMNS_CAPITAL.CELL]
          }"`,
        ],
        [
          `"${TABLES[6].TABLE}" ON "${TABLES[6].TABLE}"."${
            TABLES[6].FIELDS[0][COLUMNS_CAPITAL.DATA]
          }" = "${TABLES[5].TABLE}"."${
            TABLES[5].FIELDS[2][COLUMNS_CAPITAL.DATA]
          }"`,
        ],
      ],
      condition: `"${TABLES[4].TABLE}"."${
        TABLES[4].FIELDS[1][COLUMNS_CAPITAL.ROW]
      }" = ${rowData} 
      AND "${TABLES[6].TABLE}"."${
        TABLES[6].FIELDS[8][COLUMNS_CAPITAL.JSON_DATA]
      }" IS NOT NULL
      limit 1`,
    });
    return Object.values(rowID[0][COLUMNS.JSON_DATA])[0];
  }

  async findDataID(service, condition1, dataType) {
    let dataId = await service.selectQuery({
      tables: TABLES[6].TABLE,
      fields: [
        `"${TABLES[4].TABLE}"."${
          TABLES[4].FIELDS[0][COLUMNS_CAPITAL.CELL]
        }",        
        "${TABLES[6].TABLE}".${VARIABLE.STAR}`,
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
          `"${TABLES[1].TABLE}" ON "${TABLES[1].TABLE}"."${
            TABLES[1].FIELDS[0][COLUMNS_CAPITAL.ROW]
          }" = "${TABLES[4].TABLE}"."${
            TABLES[4].FIELDS[1][COLUMNS_CAPITAL.ROW]
          }"`,
        ],
      ],
      condition: `${condition1} AND  "${TABLES[6].TABLE}"."${
        TABLES[6].FIELDS[1][COLUMNS_CAPITAL.DATA_TYPE]
      }" = ${dataType}`,
    });
    return dataId;
  }

  async allDataIDs(defaultData, service, field, dataType) {
    const DataID = [];
    for (let element of defaultData) {
      if (typeof element === 'object' && !Array.isArray(element)) {
        for (let key in element) {
          let dataid = await this.findDataID(
            service,
            `"${TABLES[6].TABLE}"."${field}" ->> '${key}' = '${element[key]}'`,
            dataType,
          );
          if (dataid?.length) {
            DataID.push(dataid[0].Data);
          } else {
            let dataResult = await service.insertQuery(
              `"${TABLES[6].TABLE}"`,
              `"${COLUMNS.DATA_TYPE}", "${COLUMNS.JSON_DATA}"`,
              `${dataType}, '${JSON.stringify(element)}'::jsonb`,
              'RETURNING *',
              false,
            );
            DataID.push(dataResult[0].Data);
          }
        }
      } else {
        let dataid = await this.findDataID(
          service,
          `"${TABLES[6].TABLE}"."${field}" = ${element}`,
          dataType,
        );
        if (dataid?.length) {
          DataID.push(dataid[0].Data);
        } else {
          let dataResult = await service.insertQuery(
            `"${TABLES[6].TABLE}"`,
            `"${COLUMNS.DATA_TYPE}", "${field}"`,
            `${dataType}, ${element}`,
            'RETURNING *',
            false,
          );
          DataID.push(dataResult[0].Data);
        }
      }
    }
    return DataID;
  }

  async findDataNameByRowIDs(service, colName) {
    let colRowIDs = colName.replace('{', '').replace('}', '').split(',');

    // Use Promise.all with map for asynchronous operations
    let colResponseArray = await Promise.all(
      colRowIDs.map(async (element) => {
        return await this.findDataNameByRowIDUsingQuery(service, element);
      }),
    );
    return colResponseArray.join(Seprator.SEMICOLON);
  }

  async findDefaultData(service, field, cellID) {
    let dataId = await service.selectQuery({
      tables: TABLES[6].TABLE,
      fields: [`"${TABLES[6].TABLE}"."${field}"`],
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
      ],
      condition: ` "${TABLES[4].TABLE}"."${
        TABLES[4].FIELDS[0][COLUMNS_CAPITAL.CELL]
      }" = ${cellID}`,
    });
    return dataId?.length
      ? dataId.map((item) => item[COLUMNS.JSON_DATA])
      : null;
  }
}
