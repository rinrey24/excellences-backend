import { BaseEntity } from 'src/common/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('discharges')
export class Discharge extends BaseEntity {
  @Column({ type: 'varchar', length: 500 })
  discharge_status!: string;

  @Column({ type: 'varchar', length: 500 })
  description!: string;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;
}
