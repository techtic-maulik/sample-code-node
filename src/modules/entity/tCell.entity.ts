import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Row } from './tRow.entity';
import { Col } from './tCol.entity';
import { Item } from './tItem.entity';
import { Format } from './tFormat.entity';
import { COLUMNS, TABLES } from '../../common/constants';

@Entity({ name: TABLES[4].TABLE })
export class Cell {
  @PrimaryGeneratedColumn({ name: TABLES[4].FIELDS[0][COLUMNS.CELL] })
  Cell: number;

  @Column({ name: TABLES[4].FIELDS[1][COLUMNS.ROW], nullable: false })
  Row: number;

  @Column({ name: TABLES[4].FIELDS[2][COLUMNS.COL], nullable: false })
  Col: number;

  @Column({ name: TABLES[4].FIELDS[3][COLUMNS.CELL_OF_ITEMS], nullable: false })
  'Cell-#of-Items': number;

  // The t-Row.Row is the FK of the t-Cell.Row
  @ManyToOne(() => Row, (tRow) => tRow.rowCell, { onDelete: 'CASCADE' })
  @JoinColumn({ name: COLUMNS.ROW })
  cellRow: Row;

  // The t-Col.Col is the FK of the t-Cell.Col
  @ManyToOne(() => Col, (tCol) => tCol.colCell, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Col' })
  cellCol: Col;

  // The t-Cell.Cell is the FK for the t-Item.Cell
  @OneToMany(() => Item, (tItem) => tItem.itemCell, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Cell' })
  cellItem: Item[];

  // The t-Cell.Cell is the FK for the t-Format.Cell
  @OneToMany(() => Format, (tFormat) => tFormat.formatCell, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Cell' })
  cellFormat: Format[];

  // The t-Cell.Cell is the FK for the t-Format.Cell
  @OneToMany(() => Format, (tFormat) => tFormat.formatDefault, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Cell' })
  defaultFormat: Format[];
}
