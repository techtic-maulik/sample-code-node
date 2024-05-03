import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { PG } from '../../modules/entity/tpg.entity';
import { Share } from '../../modules/entity/tShare.entity';
import { Col } from '../../modules/entity/tCol.entity';
import { Row } from '../../modules/entity/tRow.entity';
import { Data } from '../../modules/entity/tData.entity';
import { Cell } from '../../modules/entity/tCell.entity';
import { Item } from '../../modules/entity/tItem.entity';
import { Format } from '../../modules/entity/tFormat.entity';
import { COLUMNS, COLUMNS_CAPITAL, TABLES } from '../../common/constants';

@Injectable()
export class ExcelDataSeederService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   */
  constructor(
    @InjectRepository(PG)
    private readonly pgRepository: Repository<PG>,
    @InjectRepository(Share)
    private readonly shareRepository: Repository<Share>,
    @InjectRepository(Col)
    private readonly colRepository: Repository<Col>,
    @InjectRepository(Row)
    private readonly rowRepository: Repository<Row>,
    @InjectRepository(Cell)
    private readonly cellRepository: Repository<Cell>,
    @InjectRepository(Data)
    private readonly dataRepository: Repository<Data>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Format)
    private readonly formatRepository: Repository<Format>,
  ) {}

  async readDataFromExcel(filePath: string): Promise<any> {
    try {
      const fileBuffer = fs.readFileSync(filePath);

      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Use XLSX.utils.sheet_to_json to convert the sheet to an array of objects
      const excelData = XLSX.utils.sheet_to_json(sheet);

      return excelData;
    } catch (error) {
      throw error;
    }
  }

  async insertPGData({ PGData, excelData, excelDataAllTypeData }) {
    // console.log("PGData==", PGData);

    /* PG: First insert all PGs in db */

    await this.pgRepository
      .createQueryBuilder()
      .insert()
      .into(TABLES[0].TABLE)
      .values(PGData)
      .execute();
    console.log(
      'pg insert==',
      await this.pgRepository
        .createQueryBuilder()
        .insert()
        .into(TABLES[0].TABLE)
        .values(PGData)
        .getQuery(),
    );

    for (let i in excelData) {
      /* RowID: First insert rowID for PG */
      // let rowIDInfo = new Share();
      // rowIDInfo.PG = excelData[i].PG;
      // rowIDInfo.Row = excelData[i].Row;

      // await this.rowIDRepository.save(rowIDInfo);
      // console.log("rowid insert=-==", await this.rowIDRepository.save(rowIDInfo));

      /* Row: First insert all Rows in db */

      let rowInfo = new Row();
      rowInfo.Row = excelData[i].Row;
      rowInfo.PG = excelData[i].PG;
      rowInfo.RowID = excelData[i].RowID;
      rowInfo.Share = excelData[i].Share;
      rowInfo.Inherit = excelData[i].Inherit;
      rowInfo[TABLES[1].FIELDS[8][COLUMNS_CAPITAL.ROW_TYPE]] =
        excelData[TABLES[1].FIELDS[8][COLUMNS_CAPITAL.ROW_TYPE]];
      rowInfo[TABLES[1].FIELDS[3][COLUMNS_CAPITAL.ROW_LEVEL]] =
        excelData[TABLES[1].FIELDS[3][COLUMNS_CAPITAL.ROW_LEVEL]];
      rowInfo[TABLES[1].FIELDS[4][COLUMNS_CAPITAL.PARENT_ROW]] =
        excelData[TABLES[1].FIELDS[4][COLUMNS_CAPITAL.PARENT_ROW]];
      rowInfo[TABLES[1].FIELDS[5][COLUMNS_CAPITAL.SIBLING_ROW]] =
        excelData[TABLES[1].FIELDS[5][COLUMNS_CAPITAL.SIBLING_ROW]];
      // console.log("rowInfo=", rowInfo);

      await this.rowRepository.save(rowInfo);
    }
  }

  async insertDataIntoTables({
    PG,
    excelData,
    excelDataAllTypeData,
    excelDataTypeData,
    isDDTInserted = false,
  }): Promise<boolean> {
    try {
      /* RowID: First insert rowID for PG */

      let shareInfo = new Share();
      // await this.shareRepository.save(shareInfo);

      /* Row: First insert all Rows in db */

      let rowInfo = new Row();
      rowInfo.Row = excelData.Row;
      rowInfo.RowID = excelData.RowID;
      rowInfo.Share = excelData.Share;
      rowInfo.Inherit = excelData.Inherit;
      rowInfo[TABLES[1].FIELDS[8][COLUMNS_CAPITAL.ROW_TYPE]] =
        excelData[TABLES[1].FIELDS[8][COLUMNS_CAPITAL.ROW_TYPE]];
      rowInfo[TABLES[1].FIELDS[3][COLUMNS_CAPITAL.ROW_LEVEL]] =
        excelData[TABLES[1].FIELDS[3][COLUMNS_CAPITAL.ROW_LEVEL]];
      rowInfo[TABLES[1].FIELDS[4][COLUMNS_CAPITAL.PARENT_ROW]] =
        excelData[TABLES[1].FIELDS[4][COLUMNS_CAPITAL.PARENT_ROW]];
      rowInfo[TABLES[1].FIELDS[5][COLUMNS_CAPITAL.SIBLING_ROW]] =
        excelData[TABLES[1].FIELDS[5][COLUMNS_CAPITAL.SIBLING_ROW]];
      // await this.rowRepository.save(rowInfo);

      /* Col */

      const colData = [];
      for (let key in excelData[0]) {
        if (excelDataAllTypeData[0].hasOwnProperty(key)) {
          colData.push({
            PG: excelData[0].PG,
            [COLUMNS.COL_NAME]: key,
            [COLUMNS.DATA_TYPE]: excelDataAllTypeData[0][key],
            [COLUMNS.DDT_SOURCE]: excelDataAllTypeData[1][key] ?? null,
          });
        }
      }
      console.log('compare colData-----', colData);

      //  await this.colRepository
      //   .createQueryBuilder()
      //   .insert()
      //   .into('t-Col')
      //   .values(colData)
      //   .execute();

      /* Cell */

      let cellInfo = new Cell();
      cellInfo.Row = excelData.Row;
      cellInfo.Col = excelData.Col;
      cellInfo[TABLES[4].FIELDS[3][COLUMNS_CAPITAL.CELL_OF_ITEMS]] =
        excelData[TABLES[4].FIELDS[3][COLUMNS_CAPITAL.CELL_OF_ITEMS]];

      // await this.cellRepository.save(cellInfo);

      let dataInfo = new Data();
      dataInfo[TABLES[6].FIELDS[1][COLUMNS_CAPITAL.DATA_TYPE]] =
        excelData[TABLES[6].FIELDS[1][COLUMNS_CAPITAL.DATA_TYPE]];
      dataInfo[TABLES[6].FIELDS[2][COLUMNS_CAPITAL.ROW_DATA]] =
        excelData[TABLES[6].FIELDS[2][COLUMNS_CAPITAL.ROW_DATA]];
      dataInfo[TABLES[6].FIELDS[3][COLUMNS_CAPITAL.DATETIME_DATA]] =
        excelData[TABLES[6].FIELDS[3][COLUMNS_CAPITAL.DATETIME_DATA]];
      dataInfo[TABLES[6].FIELDS[4][COLUMNS_CAPITAL.COLOR_DATA]] =
        excelData[TABLES[6].FIELDS[4][COLUMNS_CAPITAL.COLOR_DATA]];
      dataInfo[TABLES[6].FIELDS[5][COLUMNS_CAPITAL.INT_DATA]] =
        excelData[TABLES[6].FIELDS[5][COLUMNS_CAPITAL.INT_DATA]];
      dataInfo[TABLES[6].FIELDS[6][COLUMNS_CAPITAL.BIGINT_DATA]] =
        excelData[TABLES[6].FIELDS[6][COLUMNS_CAPITAL.BIGINT_DATA]];
      dataInfo[TABLES[6].FIELDS[7][COLUMNS_CAPITAL.NUM_DATA]] =
        excelData[TABLES[6].FIELDS[7][COLUMNS_CAPITAL.NUM_DATA]];
      dataInfo[TABLES[6].FIELDS[8][COLUMNS_CAPITAL.JSON_DATA]] =
        excelData[TABLES[6].FIELDS[8][COLUMNS_CAPITAL.JSON_DATA]];
      dataInfo[TABLES[6].FIELDS[9][COLUMNS_CAPITAL.QTY_DATA]] =
        excelData[TABLES[6].FIELDS[9][COLUMNS_CAPITAL.QTY_DATA]];
      dataInfo[TABLES[6].FIELDS[10][COLUMNS_CAPITAL.UNIT_DATA]] =
        excelData[TABLES[6].FIELDS[10][COLUMNS_CAPITAL.UNIT_DATA]];
      dataInfo[TABLES[6].FIELDS[11][COLUMNS_CAPITAL.STD_QTY_DATA]] =
        excelData[TABLES[6].FIELDS[11][COLUMNS_CAPITAL.STD_QTY_DATA]];
      dataInfo[TABLES[6].FIELDS[12][COLUMNS_CAPITAL.STD_UNIT_DATA]] =
        excelData[TABLES[6].FIELDS[12][COLUMNS_CAPITAL.STD_UNIT_DATA]];
      dataInfo[TABLES[6].FIELDS[13][COLUMNS_CAPITAL.FOREIGN_DATA]] =
        excelData[TABLES[6].FIELDS[13][COLUMNS_CAPITAL.FOREIGN_DATA]];
      // await this.dataRepository.save(dataInfo);

      /* in Item */
      if (isDDTInserted && isDDTInserted == true) {
        let itemInfo = new Item();
        itemInfo.Cell = excelData.Cell;
        itemInfo.Data = excelData.Data;
        itemInfo.Inherit = excelData.Inherit;
        // await this.itemRepository.save(itemInfo);
      }

      /* in Format */

      let formatInfo = new Format();
      formatInfo.PG = excelData.PG;
      formatInfo[TABLES[7].FIELDS[7][COLUMNS_CAPITAL.PG_NESTED_COL]] =
        excelData[TABLES[7].FIELDS[7][COLUMNS_CAPITAL.PG_NESTED_COL]];
      formatInfo[TABLES[7].FIELDS[14][COLUMNS_CAPITAL.PG_FREEZE_COL]] =
        excelData[TABLES[7].FIELDS[14][COLUMNS_CAPITAL.PG_FREEZE_COL]];
      formatInfo[TABLES[7].FIELDS[15][COLUMNS_CAPITAL.PG_LEVEL_SET]] =
        excelData[TABLES[7].FIELDS[15][COLUMNS_CAPITAL.PG_LEVEL_SET]];
      formatInfo[TABLES[7].FIELDS[16][COLUMNS_CAPITAL.PG_SEARCH_SET]] =
        excelData[TABLES[7].FIELDS[16][COLUMNS_CAPITAL.PG_SEARCH_SET]];
      formatInfo[TABLES[7].FIELDS[8][COLUMNS_CAPITAL.PG_EXPAND]] =
        excelData[TABLES[7].FIELDS[8][COLUMNS_CAPITAL.PG_EXPAND]];
      formatInfo[TABLES[7].FIELDS[17][COLUMNS_CAPITAL.PG_SORT]] =
        excelData[TABLES[7].FIELDS[17][COLUMNS_CAPITAL.PG_SORT]];
      formatInfo[TABLES[7].FIELDS[18][COLUMNS_CAPITAL.PG_FILTER]] =
        excelData[TABLES[7].FIELDS[18][COLUMNS_CAPITAL.PG_FILTER]];
      formatInfo.Row = excelData.Row;
      formatInfo[TABLES[7].FIELDS[20][COLUMNS_CAPITAL.SHOWSET_TICK]] =
        excelData[TABLES[7].FIELDS[20][COLUMNS_CAPITAL.SHOWSET_TICK]];
      formatInfo.Share = excelData.Share;
      formatInfo.Col = excelData.Col;
      formatInfo[TABLES[7].FIELDS[2][COLUMNS_CAPITAL.COL_ORDER]] =
        excelData[TABLES[7].FIELDS[2][COLUMNS_CAPITAL.COL_ORDER]];
      formatInfo[TABLES[7].FIELDS[3][COLUMNS_CAPITAL.COL_MIN_WIDTH]] =
        excelData[TABLES[7].FIELDS[3][COLUMNS_CAPITAL.COL_MIN_WIDTH]];
      formatInfo.Cell = excelData.Cell;
      formatInfo.Item = excelData.Item;
      formatInfo[TABLES[7].FIELDS[10][COLUMNS_CAPITAL.ITEM_ORDER]] =
        excelData[TABLES[7].FIELDS[10][COLUMNS_CAPITAL.ITEM_ORDER]];
      formatInfo.Data = excelData.Data;
      formatInfo.Unit = excelData.Unit;
      formatInfo.Formula = excelData.Formula;
      formatInfo.Status = excelData.Status;
      formatInfo.Default = excelData.Default;
      formatInfo[TABLES[7].FIELDS[23][COLUMNS_CAPITAL.FONT_STYLE]] =
        excelData[TABLES[7].FIELDS[23][COLUMNS_CAPITAL.FONT_STYLE]];
      formatInfo.Comment = excelData.Comment;
      formatInfo[TABLES[7].FIELDS[26][COLUMNS_CAPITAL.AUDIT_TRAIL]] =
        excelData[TABLES[7].FIELDS[26][COLUMNS_CAPITAL.AUDIT_TRAIL]];
      formatInfo.Deleted = excelData.Deleted;
      formatInfo[TABLES[7].FIELDS[27][COLUMNS_CAPITAL.DELETED_BY]] =
        excelData[TABLES[7].FIELDS[27][COLUMNS_CAPITAL.DELETED_BY]];
      formatInfo[TABLES[7].FIELDS[28][COLUMNS_CAPITAL.DELETED_AT]] =
        excelData[TABLES[7].FIELDS[28][COLUMNS_CAPITAL.DELETED_AT]];
      // await this.formatRepository.save(formatInfo);

      return true;
    } catch (error) {
      console.log('error 1===', error);
      throw error;
    }
  }

  async insertData(): Promise<boolean> {
    try {
      /* insert data into PG till t-Row table */
      const masterPGFile = path.resolve(__dirname, '../../../MasterPG.xlsx');
      const excelData = await this.readDataFromExcel(masterPGFile);

      const colDataTypeFile = path.resolve(
        __dirname,
        '../../../data-type.xlsx',
      );
      const excelDataAllTypeData =
        await this.readDataFromExcel(colDataTypeFile);

      let PGIds = [];
      excelData.filter((item) => {
        for (let [key, value] of Object.entries(item)) {
          if (key === COLUMNS.PG) {
            PGIds.push({ PG: value });
          }
        }
      });

      await this.insertPGData({
        PGData: PGIds,
        excelData,
        excelDataAllTypeData,
      });

      /* */

      /* insert dataType  */
      const allDataTypeFIle = path.resolve(__dirname, '../../../All-DDT.xlsx');
      const excelDataTypeData = await this.readDataFromExcel(allDataTypeFIle);

      // for(let i in excelData){
      //   let data = excelData[i];
      //   await this.insertDataIntoTables({ PG: '10000003',excelData: data, excelDataAllTypeData, excelDataTypeData,isDDTInserted: false});
      // }

      return true;
    } catch (error) {
      console.log('error===', error);
      throw error;
    }
  }
}
