import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  Request,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RowService } from '../../shared/services/row/row.service';
import { CreateRowDto } from './dto/create-row.dto';
import { Response } from 'express';

@Controller('row')
export class RowController {
  constructor(private readonly rowService: RowService) {}

  @Post()
  async createRow(@Body() body: CreateRowDto, @Res() res: any): Promise<any> {
    return await this.rowService
      .create(body)
      .then(async (response) => {
        return res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          data: response,
        });
      })
      .catch((error: any) => {
        throw new UnprocessableEntityException(error.message);
      });
  }

  @Get('/generateRow')
  async getAllTGData(
    @Request() request: any,
    @Res() res: Response,
  ): Promise<any> {
    return await this.rowService
      .generateRow()
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

  @Post('/formatRow')
  async formatRow(@Body() body: any, @Res() res: any): Promise<any> {
    return await this.rowService
      .formatRow(body)
      .then(async (response) => {
        return res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          data: response,
        });
      })
      .catch((error: any) => {
        throw new UnprocessableEntityException(error.message);
      });
  }
}
