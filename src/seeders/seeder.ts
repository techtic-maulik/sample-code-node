import { Injectable, Logger } from '@nestjs/common';
import { ExcelDataSeederService } from './excelData/excelData.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly logger: Logger,
    private readonly excelDataSeederService: ExcelDataSeederService,
  ) {}
  async seed(table) {
    let response;
    response = this.excelDataSeederService.insertData();

    await response
      .then((completed) => {
        Promise.resolve(completed);
      })
      .catch((error) => {
        Promise.reject(error);
      });
  }
  async all() {
    return await Promise.all([await this.excelDataSeederService.insertData()]);
  }
}
