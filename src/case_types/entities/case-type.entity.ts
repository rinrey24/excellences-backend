import { BaseEntity } from 'src/common/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('case_types')
export class CaseType extends BaseEntity {
  @Column({ type: 'varchar', length: 500 })
  tipe_kasus!: string;

  @Column({ type: 'varchar', length: 500 })
  description!: string;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;
}
