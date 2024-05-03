import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Row } from 'src/modules/entity/tRow.entity';
import { EntityManager, Repository } from 'typeorm';
import { PostgreSQLService } from '../../../common/postgresql.service';
import { CommonJSMethodService } from '../../../common/commonjsMethods.service';
import { LABEL } from '../../../common/constants';
@Injectable()
export class SocialMediaService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(Row)
    private readonly rowRepository: Repository<Row>,
    private readonly postgreSQLService: PostgreSQLService,
    private readonly commonJSMethodService: CommonJSMethodService,
  ) {}

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
  async createUser(userData: object): Promise<any> {
    try {
      // console.log('create User=', userData);
      //check if user is new then insert
      let rowData = [];
      rowData = await this.insertUserRows();
      await this.insertUserCells(rowData);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async insertUserRows(): Promise<any> {
    try {
      /* The system creates a User-Profile for user by Inheriting 'all descendant rows' of the User-Profile Labels (in All-Label) */
      let rowData = [],
        inheritParentChild = [],
        parentRow = null,
        siblingRow = null;
      const userProfileRow = await this.entityManager
        .query(`select "t-Row"."Row" from "t-Data" 
        join "t-Item" on "t-Item"."Data" ="t-Data"."Data" 
        join "t-Cell" on "t-Cell"."Cell" = "t-Item"."Cell" 
        join "t-Row" on "t-Row"."Row" = "t-Cell"."Row" 
        join "t-TG" on "t-TG"."TG" = "t-Row"."TG" 
          WHERE EXISTS (
          SELECT 1
          FROM jsonb_each_text("JSON-Data") AS j
          WHERE j.value = '${LABEL.USER_PROFILE_LABEL}')`);

      const userProfRowsFromAllLabels = await this.entityManager.query(`
      WITH RECURSIVE descendants AS (
        SELECT tr.*
        FROM "t-Row" tr
        WHERE "Row" = (${userProfileRow[0].Row})
        UNION
        SELECT r.*
        FROM "t-Row" r
        JOIN descendants d ON r."Parent-Row" = d."Row"
      ) SELECT descendants.*,
      (select jsonb_agg(jsonb_build_object(
    'Col', "t-Cell"."Col",'Col-Name', "t-Col"."Col-Name",'Row-Data',COALESCE("t-Data"."Row-Data",0) ))
    AS rowData
   from "t-Cell"
      join "t-Col" on "t-Col"."Col" = "t-Cell"."Col"
      join "t-Item" on "t-Item"."Cell"  = "t-Cell"."Cell"
      join "t-Data" on  "t-Data"."Data" =  "t-Item"."Data"
      where "t-Cell"."Row" = descendants."Row") FROM Descendants where "Row" != ${userProfileRow[0].Row} order by "Row"`);

      /* Get TG Id from UserProfile or use direct ID?
      store in profiles TG */

      const profilesTG =
        await this.postgreSQLService.getPGIDByPGName('All Users');

      let lastInsertedRow = await this.postgreSQLService.getLastInsertedRow();
      lastInsertedRow = lastInsertedRow + 1;

      let sectionHeadRow =
        await this.postgreSQLService.getRowByJSONDataValue('Section-Head');
      sectionHeadRow = sectionHeadRow.Row;

      for (let upr in userProfRowsFromAllLabels) {
        userProfRowsFromAllLabels[upr].inheritsRow = lastInsertedRow;

        const isSectionHead = userProfRowsFromAllLabels[upr].rowdata.some(
          (item) => item['Row-Data'] == sectionHeadRow,
        );
        const compareRowLevel =
          Number(userProfRowsFromAllLabels[upr]['Row-Level']) - 1;
        // console.log('isSectionHead=', isSectionHead);
        if (isSectionHead) {
          userProfRowsFromAllLabels[upr].isSectionHead = true;
          parentRow = null;
          siblingRow = null;
        } else {
          userProfRowsFromAllLabels[upr].isSectionHead = false;
          if (compareRowLevel == 1) {
            //level 1
            parentRow = await this.commonJSMethodService.filterArray(
              userProfRowsFromAllLabels,
              'isSectionHead',
              true,
            );
            parentRow = parentRow[0].inheritsRow;
          } else {
            parentRow = await this.commonJSMethodService.filterArray(
              userProfRowsFromAllLabels,
              'Row',
              userProfRowsFromAllLabels[upr]['Parent-Row'],
            );

            parentRow = parentRow[0]['inheritsRow'];
          }

          const previousObj: number = parseInt(upr) - 1;

          if (userProfRowsFromAllLabels[previousObj].isSectionHead == false) {
            siblingRow = await this.commonJSMethodService.filterArray(
              userProfRowsFromAllLabels,
              'Row',
              userProfRowsFromAllLabels[upr]['Sibling-Row'],
            );
            siblingRow = siblingRow[0]?.inheritsRow;
          }
        }
        //section head level 0, change parent of section head, 1st level after section-head
        let inherit = [];
        inherit.push(Number(userProfRowsFromAllLabels[upr].Row));

        rowData.push({
          TG: profilesTG,
          Row: lastInsertedRow,
          RowID: lastInsertedRow,
          Share: null,
          Inherit: Number(userProfRowsFromAllLabels[upr].Row),
          'Row-Level': compareRowLevel,
          'Parent-Row': parentRow ? Number(parentRow) : null,
          'Sibling-Row': siblingRow ? Number(siblingRow) : null,
        });

        let insertRowResult = await this.entityManager
          .query(`INSERT INTO "t-Row"("Row","TG", "RowID",  "Inherit", "Row-Level", "Parent-Row", "Sibling-Row")
                VALUES (${lastInsertedRow},${profilesTG},${lastInsertedRow}, Array[${inherit}], ${compareRowLevel},  ${
                  parentRow ? Number(parentRow) : null
                },  ${
                  siblingRow ? Number(siblingRow) : null
                }) RETURNING "Row";`);

        lastInsertedRow = Number(insertRowResult[0].Row) + 1;
        inheritParentChild.push({
          Row: lastInsertedRow,
        });
      }
      return rowData;
      // console.log('insertData-', insertData);
    } catch (error) {
      throw error;
    }
  }

  async insertUserCells(rowData): Promise<any> {
    try {
      //get columns of user profile
      const userProfileColumns = await this.entityManager
        .query(`select * from "t-Col" where "t-Col"."TG" = (select "t-TG"."TG" from "t-Data"
        join "t-Item" on "t-Item"."Data" ="t-Data"."Data" 
        join "t-Cell" on "t-Cell"."Cell" = "t-Item"."Cell" 
        join "t-Row" on "t-Row"."Row" = "t-Cell"."Row" 
        join "t-TG" on "t-TG"."TG" = "t-Row"."TG" 
          WHERE EXISTS (
          SELECT *
          FROM jsonb_each_text("JSON-Data") AS j
          WHERE j.value = 'All Users'))`);
      console.log('userProfileColumns=', userProfileColumns);

      return userProfileColumns;
    } catch (error) {
      throw error;
    }
  }
}
