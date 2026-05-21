// rule-condition.entity.ts
import {
  Entity,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Rule } from './rule.entity';
import { RuleConditionGroup } from './rule-condition-group.entity';
import { RuleOperator } from 'src/common/enums/rule-operator.enum';

@Entity('rule_conditions')
@Index(['field_name'])
export class RuleCondition extends BaseEntity {

  @ManyToOne(
    () => Rule,
    { onDelete: 'CASCADE' }
  )
  rule!: Rule;

  @ManyToOne(
    () => RuleConditionGroup,
    group => group.conditions,
    { onDelete: 'CASCADE' }
  )
  group!: RuleConditionGroup;

  @Column({ length: 100 })
  field_name!: string;

  @Column({
    type: 'enum',
    enum: RuleOperator,
  })
  operator!: RuleOperator;

  @Column({ type: 'text' })
  value!: string;

  @Column({ default: 'STRING' })
  value_type!: 'STRING' | 'NUMBER' | 'DATE' | 'ARRAY';
}