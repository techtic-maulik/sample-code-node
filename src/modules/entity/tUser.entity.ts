import { Entity, Column, OneToMany, JoinColumn, Unique } from 'typeorm';
import { Row } from './tRow.entity';
import { Tx } from './tTx.entity';
import { Format } from './tFormat.entity';

@Entity({ name: 't-User' })
export class User {
  @Unique(['User'])
  @Column({ unique: true, primary: true, nullable: false })
  User: number;

  // The t-Row.Row is the FK of the t-User.User
  @OneToMany(() => Row, (tRow) => tRow.rowUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'User' })
  user: Row[];

  // The t-User.User is the FK for the t-Tx['Tx-Type']
  @OneToMany(() => Tx, (tTx) => tTx.txUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'User' })
  txUser: Tx[];

  // The t-User.User is the FK for the t-Format['Deleted-By']
  @OneToMany(() => Format, (tFormat) => tFormat.formatUser, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'User' })
  userFormat: Format[];
}
