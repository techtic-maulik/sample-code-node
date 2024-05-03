import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Row } from './tRow.entity';
import { User } from './tUser.entity';

@Entity({ name: 't-Tx' })
export class Tx {
  @PrimaryGeneratedColumn()
  Tx: number;

  @Column({ nullable: false })
  'Tx-Type': number;

  @Column({ type: 'jsonb' })
  'Tx-Objects': string;

  @Column({ nullable: false })
  'Tx-User': number;

  @Column({ type: 'timestamp' })
  'Tx-DateTime': Date;

  @Column({ type: 'bigint' })
  'Tx-XID': number;

  // The t-Tx['Tx-Type'] is the FK of the t-Row.Row
  @OneToMany(() => Row, (tRow) => tRow.txRow, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Tx-Type' })
  txTypeRow: Row[];

  // The t-Tx['Tx-User'] is the FK of the t-User.User
  @ManyToOne(() => User, (tUser) => tUser.txUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Tx-User' })
  txUser: User;
}
