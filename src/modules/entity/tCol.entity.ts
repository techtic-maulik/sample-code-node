import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { PG } from './tpg.entity';
import { Row } from './tRow.entity';
import { Cell } from './tCell.entity';
import { Format } from './tFormat.entity';

@Entity('t-Col')
export class Col {
  @PrimaryGeneratedColumn()
  Col: number;

  @Column({ nullable: false })
  PG: number;

  @Column({ type: 'jsonb', nullable: false })
  'Col-Name': string;

  @Column({ nullable: false })
  'Data-Type': number;

  @Column('simple-array', { array: true })
  'DDT-Source': number[];

  // The t-Col.PG is FK of the t-PG.PG
  @ManyToOne(() => PG, (pg) => pg.pgCol, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PG' })
  colPg: PG;

  // The t-Col['Data-Type'] is FK of the t-Row.Row
  @ManyToOne(() => Row, (row) => row.dataType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Data-Type' })
  dType: Row;

  // The t-Col.Col is FK for the t-Cell.Col
  @OneToMany(() => Cell, (tCell) => tCell.cellCol, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Col' })
  colCell: Cell[];

  // The t-Col.Col is FK for the t-Format.PG-Nested-Col
  @OneToMany(() => Format, (tFormat) => tFormat.formatPGNestedCol, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Col' })
  colPGNested: Format;

  // The t-Col.Col is FK for the t-Format.PG
  @OneToMany(() => Format, (tFormat) => tFormat.formatCol, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Col' })
  colFormat: Format[];
}
