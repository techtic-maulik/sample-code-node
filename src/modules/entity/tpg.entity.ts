import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Col } from './tCol.entity';
import { Format } from './tFormat.entity';
import { Row } from './tRow.entity';
import { COLUMNS, TABLES } from '../../common/constants';

@Entity(TABLES[0].TABLE)
export class PG {
  @PrimaryGeneratedColumn({ name: TABLES[0].FIELDS[0][COLUMNS.PG] })
  PG: number;

  // The t-PG.PG is FK for the t-Row.PG
  @OneToMany(() => Row, (tRow) => tRow.rowPG, { onDelete: 'CASCADE' })
  @JoinColumn({ name: COLUMNS.PG })
  pgRow: Row[];

  // The t-PG.PG is FK for the t-Col.PG
  @OneToMany(() => Col, (tCol) => tCol.colPg, { onDelete: 'CASCADE' })
  @JoinColumn({ name: COLUMNS.PG })
  pgCol: Col[];

  // The t-PG.PG is FK for the t-Format.PG
  @OneToMany(() => Format, (tFormat) => tFormat.formatPG, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: COLUMNS.PG })
  pgFormat: Format[];

  // The t-PG.PG is FK for the t-Format.PG-Level-Set
  @OneToOne(() => Format, (tFormat) => tFormat.formatPGLevelSet, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: COLUMNS.PG })
  pgLevelSet: Format;

  // The t-PG.PG is FK for the t-Format.PG-Search-Set
  @OneToOne(() => Format, (tFormat) => tFormat.formatPGSearchSet, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: COLUMNS.PG })
  pgSearchSet: Format;
}
