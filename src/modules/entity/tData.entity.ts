import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Row } from './tRow.entity';
import { Format } from './tFormat.entity';
import { Item } from './tItem.entity';

@Entity('t-Data')
export class Data {
  @PrimaryGeneratedColumn()
  Data: number;

  @Column({ nullable: false })
  'Data-Type': number;

  @Column()
  'Row-Data': number;

  @Column({ type: 'timestamp' })
  'DateTime-Data': Date;

  @Column()
  'Color-Data': number;

  @Column()
  'Int-Data': number;

  @Column()
  'BigInt-Data': number;

  @Column()
  'Num-Data': number;

  @Column({ type: 'jsonb' })
  'JSON-Data': string;

  @Column()
  'Qty-Data': number;

  @Column()
  'Unit-Data': number;

  @Column()
  'Std-Qty-Data': number;

  @Column()
  'Std-Unit-Data': number;

  @Column()
  'Foreign-Data': string;

  // The t-Row.Row is the FK of the t-Data['Data-Type']
  @ManyToOne(() => Row, (tRow) => tRow.rowDataType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Data-Type' })
  tDataDataType: Row;

  // The t-Row.Row is the FK of the t-Data['Unit-Data']
  @ManyToOne(() => Row, (tRow) => tRow.rowUnitData, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Unit-Data' })
  tDataUnitData: Row;

  // The t-Row.Row is the FK of the t-Data['Std-Unit-Data']
  @ManyToOne(() => Row, (tRow) => tRow.rowStdUnitData, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Std-Unit-Data' })
  tDataStdUnitData: Row;

  // The t-Data.Data is the FK for the t-Item.Data
  @OneToMany(() => Item, (tItem) => tItem.itemData, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Data' })
  dataItem: Item[];

  // The t-Data.Data is the FK for the t-Format.Data
  @OneToMany(() => Format, (tFormat) => tFormat.formatData, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Data' })
  dataFormat: Format[];
}
