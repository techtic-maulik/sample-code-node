import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { PG } from './tpg.entity';
import { Col } from './tCol.entity';
import { Row } from './tRow.entity';
import { Cell } from './tCell.entity';
import { Data } from './tData.entity';
import { Item } from './tItem.entity';
import { Share } from './tShare.entity';
import { User } from './tUser.entity';

@Entity({ name: 't-Format' })
export class Format {
  @PrimaryGeneratedColumn()
  Format: number;

  @Column()
  PG: number;

  @Column()
  'PG-Nested-Col': number;

  @Column()
  'PG-Freeze-Col': number;

  @Column()
  'PG-Expand': number;

  @Column()
  'PG-Level-Set': number;

  @Column()
  'PG-Search-Set': number;

  @Column({ type: 'jsonb' })
  'PG-Sort': string;

  @Column({ type: 'jsonb' })
  'PG-Filter': string;

  @Column()
  Row: number;

  @Column()
  'ShowSet-Tick': number;

  @Column()
  'Share': number;

  @Column()
  Col: number;

  @Column()
  'Col-Order': number;

  @Column()
  'Col-Min-Width': number;

  @Column()
  Cell: number;

  @Column()
  Item: number;

  @Column()
  'Item-Order': number;

  @Column()
  Data: number;

  @Column()
  Default: number;

  @Column('simple-array', { array: true })
  Status: number[];

  @Column()
  Unit: number;

  @Column({ type: 'jsonb' })
  'Font-Style': string;

  @Column({ type: 'jsonb' })
  'Formula': string;

  @Column({ type: 'jsonb' })
  Comment: string;

  @Column({ type: 'jsonb', nullable: false })
  'Audit-Trail': string;

  @Column({ nullable: false, default: false })
  'Deleted': boolean;

  @Column()
  'Deleted-By': number;

  @Column({ type: 'timestamp' })
  'Deleted-At': Date;

  // The t-PG.PG is the FK of the t-Format.PG
  @ManyToOne(() => PG, (tPG) => tPG.pgFormat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PG' })
  formatPG: PG;

  // The t-Col.Col is the FK of the t-Format.PG-Nested-Col
  @OneToOne(() => Col, (tCol) => tCol.colPGNested, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PG-Nested-Col' })
  formatPGNestedCol: Col;

  // The t-PG.PG is the FK of the t-Format.PG-Level-Set
  @OneToOne(() => PG, (tPG) => tPG.pgLevelSet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PG-Level-Set' })
  formatPGLevelSet: PG;

  // The t-PG.PG is the FK of the t-Format.PG-Search-Set
  @OneToOne(() => PG, (tPG) => tPG.pgSearchSet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PG-Search-Set' })
  formatPGSearchSet: PG;

  // The t-Row.Row is the FK of the t-Format.Row
  @ManyToOne(() => Row, (tRow) => tRow.rowIDRow, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Row' })
  formatRow: Row;

  // The t-Row.Row is the FK of the t-Format.ShowSet-Tick
  @ManyToOne(() => Row, (tRow) => tRow.rowShowSetTick, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ShowSet-Tick' })
  formatShowSetTick: Row;

  // The t-Share.Share is the FK of the t-Format.Share
  @ManyToOne(() => Share, (tShare) => tShare.shareFormat, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Share' })
  formatShare: Share;

  // The t-Col.Col is the FK of the t-Format.Col
  @ManyToOne(() => Col, (tCol) => tCol.colFormat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Col' })
  formatCol: Col;

  // The t-Cell.Cell is the FK of the t-Format.Cell
  @ManyToOne(() => Cell, (tCell) => tCell.cellFormat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Cell' })
  formatCell: Cell;

  // The t-Item.Item is the FK of the t-Format.Item
  @ManyToOne(() => Item, (tItem) => tItem.itemFormat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Item' })
  formatItem: Item;

  // The t-Data.Data is the FK of the t-Format.Data
  @ManyToOne(() => Data, (tData) => tData.dataFormat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Data' })
  formatData: Data;

  // The t-Cell.Cell is the FK of the t-Format.Default
  @ManyToOne(() => Cell, (tCell) => tCell.defaultFormat, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Default' })
  formatDefault: Cell;

  // The t-Row.Row is the FK of the t-Format.Unit
  @ManyToOne(() => Row, (tRow) => tRow.rowUnit, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Unit' })
  formatUnit: Row;

  // The t-Row.Row is the FK of the t-Format.Deleted
  @OneToOne(() => Row, (tRow) => tRow.rowDeleted, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Deleted' })
  formatDeleted: Row;

  // The t-User.User is the FK of the t-Format['Deleted-By']
  @ManyToOne(() => User, (tUser) => tUser.userFormat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Deleted-By' })
  formatUser: User;
}
