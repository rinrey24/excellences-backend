// modules/rules/entities/rule.entity.ts
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Hospital } from 'src/hospitals/entities/hospital.entity';
import { RuleStatus } from 'src/common/enums/rule-status.enum';
import { RuleCondition } from './rule-condition.entity';
import { RuleAction } from './rule-action.entity';
import { RuleConditionGroup } from './rule-condition-group.entity';

@Entity('rules')
@Index(['status', 'effective_start_date'])
export class Rule extends BaseEntity {

  @Column({ length: 200 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ length: 100 })
  category!: string;

  @Column({ length: 20 })
  severity_level!: 'LOW' | 'MEDIUM' | 'HIGH';

  @Column({ default: 0 })
  base_score!: number;

  @Column({
    type: 'enum',
    enum: RuleStatus,
    default: RuleStatus.DRAFT,
  })
  status!: RuleStatus;

  @Column({ default: 1 })
  version!: number;

  @Column({ type: 'date', nullable: true })
  effective_start_date?: Date;

  @Column({ type: 'date', nullable: true })
  effective_end_date?: Date;

  // ===== RELATION =====

  @OneToMany(
    () => RuleConditionGroup,
    group => group.rule,
    { cascade: true }
  )
  condition_groups!: RuleConditionGroup[];

  @OneToMany(
    () => RuleAction,
    action => action.rule,
    { cascade: true }
  )
  actions!: RuleAction[];

  @ManyToOne(() => Hospital, (hospital) => hospital.rules, {
    nullable: true,
  })
  hospital?: Hospital;
}
