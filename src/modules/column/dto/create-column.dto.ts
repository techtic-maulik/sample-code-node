import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateColumnDto {
  @ApiProperty()
  'Col': string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The PG should not be empty' })
  'PG': string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The Col-Name should not be empty' })
  'Col-Name': string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The Col-Order should not be empty' })
  'Col-Order': number;

  @ApiProperty()
  @IsNotEmpty({ message: 'The Data-Type should not be empty' })
  'Data-Type': string;

  @ApiProperty()
  'Default': string;

  @ApiProperty()
  'Status': Array<string>;

  @ApiProperty()
  'Formula': Array<string>;
}
