import {
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Format } from './tFormat.entity';
import { Row } from './tRow.entity';

@Entity('t-Share')
export class Share {
  @PrimaryGeneratedColumn()
  Share: number;

  // The t-Share.Share is the FK for the t-Row.Share
  @OneToOne(() => Row, (tRow) => tRow.rowShare, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Share' })
  shareRow: Share;

  // The t-Share.Share is the FK for the t-Format.Share
  @OneToOne(() => Format, (tFormat) => tFormat.formatShare, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Share' })
  shareFormat: Share;
}
