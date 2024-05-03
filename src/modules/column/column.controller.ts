import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UnprocessableEntityException,
  Delete,
  Param,
} from '@nestjs/common';
import { ColumnService } from '../../shared/services/column/column.service';
import { CreateColumnDto } from './dto/create-column.dto';

@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post()
  async createColumn(
    @Body() body: CreateColumnDto,
    @Res() res: any,
  ): Promise<any> {
    return await this.columnService
      .create(body)
      .then(async (response) => {
        return res.status(response.status).json({
          status: response.status,
          message: response.message,
        });
      })
      .catch((error: any) => {
        throw new UnprocessableEntityException(error.message);
      });
  }

  @Delete('/:id')
  async delete(
    @Param('id') id,
    @Body() body: any,
    @Res() res: any,
  ): Promise<any> {
    return await this.columnService
      .delete(id, body)
      .then(async (response) => {
        return res.status(response.status).json({
          status: response.status,
          message: response.message,
        });
      })
      .catch((error: any) => {
        throw new UnprocessableEntityException(error);
      });
  }

  @Post('/hide&show/:id')
  async updateStatus(
    @Param('id') id,
    @Body() body: any,
    @Res() res: any,
  ): Promise<any> {
    return await this.columnService
      .update(id, body)
      .then(async (response: any) => {
        return res.status(response.status).json({
          status: response.status,
          message: response.message,
        });
      })
      .catch((error: any) => {
        throw new UnprocessableEntityException(error.message);
      });
  }

  @Post('/formatColumn')
  async formatColumn(@Body() body: any, @Res() res: any): Promise<any> {
    return await this.columnService
      .formatColumn(body)
      .then(async (response: any) => {
        return res.status(response.status).json({
          status: response.status,
          message: response.message,
        });
      })
      .catch((error: any) => {
        throw new UnprocessableEntityException(error.message);
      });
  }
}
