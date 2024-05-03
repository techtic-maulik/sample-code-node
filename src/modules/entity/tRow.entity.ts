import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './tUser.entity';
import { Col } from './tCol.entity';
import { Cell } from './tCell.entity';
import { Data } from './tData.entity';
import { Format } from './tFormat.entity';
import { PG } from './tpg.entity';
import { Share } from './tShare.entity';
import { Item } from './tItem.entity';
import { Tx } from './tTx.entity';

@Entity('t-Row')
export class Row {
  @PrimaryGeneratedColumn()
  Row: number;

  @Column({ nullable: false })
  PG: number;

  @Column({ nullable: false })
  RowID: number;

  @Column()
  Share: number;

  @Column('simple-array', { array: true })
  Inherit: number[];

  @Column('simple-array', { array: true })
  'Row-Type': number[];

  @Column({ nullable: false, default: 1 })
  'Row-Level': number;

  @Column()
  'Parent-Row': number;

  @Column()
  'Sibling-Row': number;

  // The t-PG.PG is the FK of the t-Row.PG
  @OneToOne(() => PG, (pg) => pg.pgRow, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PG' })
  rowPG: PG;

  // The t-Share.Share is the FK of the t-Row.Share
  @OneToOne(() => Share, (tShare) => tShare.shareRow, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Share' })
  rowShare: Share;

  // The t-Row.Row is the FK for the t-User.User
  @OneToMany(() => User, (tUser) => tUser.user, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Row' })
  rowUser: User[];

  // The t-Row.Row is the FK for the t-Row.Parent-Row
  @OneToOne(() => Row, (row) => row.Row, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Parent-Row' })
  parent: Row;

  // The t-Row.Row is the FK for the t-Row.Sibling-Row
  @OneToOne(() => Row, (row) => row.Row, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Sibling-Row' })
  sibling: Row;

  // The t-Row.Row is the FK for the t-Col['Data-Type']
  @OneToMany(() => Col, (tCol) => tCol['Data-Type'], { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Row' })
  dataType: Col[];

  // The t-Row.Row is the FK for the t-Cell.Cell
  @OneToMany(() => Cell, (tCell) => tCell.cellRow, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Row' })
  rowCell: User[];

  // The t-Row.Row is the FK for the t-Data['Data-Type']
  @OneToMany(() => Data, (tData) => tData.tDataDataType, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Row' })
  rowDataType: Data[];

  // The t-Row.Row is the FK for the t-Data['Unit-Data']
  @OneToMany(() => Data, (tData) => tData.tDataUnitData, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Row' })
  rowUnitData: Data[];

  // The t-Row.Row is the FK for the t-Data['Std-Unit-Data']
  @OneToMany(() => Data, (tData) => tData.tDataStdUnitData, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Row' })
  rowStdUnitData: Data[];

  // The t-Row.Row is the FK for the t-Format.Row
  @OneToMany(() => Format, (tFormat) => tFormat.formatRow, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Row' })
  rowIDRow: Row[];

  // The t-Row.Row is the FK for the t-Format['ShowSet-Tick']
  @OneToMany(() => Format, (tFormat) => tFormat.formatShowSetTick, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Row' })
  rowShowSetTick: Format[];

  // The t-Row.Row is the FK for the t-Format.Unit
  @OneToMany(() => Format, (tFormat) => tFormat.formatUnit, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Row' })
  rowUnit: Row[];

  // The t-Row.Row is the FK for the t-Format.Calculated
  @OneToOne(() => Format, (tFormat) => tFormat.formatDeleted, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Row' })
  rowDeleted: Format;

  // The t-Row.Row is the FK for the t-Tx['Tx-Type']
  @ManyToOne(() => Tx, (tTx) => tTx.txTypeRow, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Row' })
  txRow: Row;
}
