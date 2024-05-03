import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRowDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'The Row should not be empty' })
  Row: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The RowID should not be empty' })
  RowID: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The type should not be empty' })
  type: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The PG should not be empty' })
  PG: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The Row should not be empty' })
  selectedRow: string;
}
