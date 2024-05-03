import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Cell } from './tCell.entity';
import { Format } from './tFormat.entity';
import { Data } from './tData.entity';

@Entity({ name: 't-Item' })
export class Item {
  @PrimaryGeneratedColumn()
  Item: number;

  @Column({ nullable: false })
  Cell: number;

  @Column({ nullable: false })
  Data: number;

  @Column('simple-array', { array: true })
  Inherit: number[];

  // The t-Cell.Cell is the FK of the t-Item.Cell
  @ManyToOne(() => Cell, (tCell) => tCell.cellItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Cell' })
  itemCell: Cell;

  // The t-Data.Data is the FK of the t-Item.Data
  @ManyToOne(() => Data, (tData) => tData.dataItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Data' })
  itemData: Data;

  // The t-Item.Item is the FK for the t-Format.Item
  @OneToMany(() => Format, (tFormat) => tFormat.formatItem, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Item' })
  itemFormat: Format[];
}
