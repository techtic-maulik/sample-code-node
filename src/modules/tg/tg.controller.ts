import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Request,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { TgService } from '../../shared/services/tg/tg.service';
import { API, MESSAGE } from '../../common/constants';

@Controller('tg')
export class TgController {
  constructor(private tgService: TgService) {}

  @Get(API.GET_ALL_DDT)
  @ApiOkResponse({ description: MESSAGE.AUTHENTICATED_SUCCESSFULLY })
  @ApiBadRequestResponse({ description: MESSAGE.BAD_REQUEST })
  async getAllTGData(
    @Request() request: any,
    @Res() res: Response,
  ): Promise<any> {
    return await this.tgService
      .getAll()
      .then(async (response) => {
        return res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          data: response,
        });
      })
      .catch((error: any) => {
        throw new UnprocessableEntityException(error);
      });
  }

  @Get(API.GET_PG_BY_ID)
  @ApiOkResponse({ description: MESSAGE.AUTHENTICATED_SUCCESSFULLY })
  @ApiBadRequestResponse({ description: MESSAGE.BAD_REQUEST })
  async getTGById(
    @Param('id') id,
    @Request() request: any,
    @Res() res: Response,
  ): Promise<any> {
    return await this.tgService
      .getById(id)
      .then(async (response) => {
        return res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          data: response[0],
        });
      })
      .catch((error: any) => {
        throw new UnprocessableEntityException(error);
      });
  }
}
