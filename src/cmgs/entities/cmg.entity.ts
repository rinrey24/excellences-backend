import { BaseEntity } from 'src/common/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('cmgs')
export class Cmg extends BaseEntity {
  @Column({ type: 'varchar', length: 500 })
  code_cmg!: string;

  @Column({ type: 'varchar', length: 500 })
  description!: string;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;
}
