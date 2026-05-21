// rule-condition-group.entity.ts
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Rule } from './rule.entity';
import { RuleCondition } from './rule-condition.entity';
import { RuleLogicalOperator } from 'src/common/enums/rule-logical-operator.enum';

@Entity('rule_condition_groups')
export class RuleConditionGroup extends BaseEntity {

  @ManyToOne(
    () => Rule,
    rule => rule.condition_groups,
    { onDelete: 'CASCADE' }
  )
  rule!: Rule;

  // Self reference (parent)
  @ManyToOne(
    () => RuleConditionGroup,
    group => group.children,
    { nullable: true, onDelete: 'CASCADE' }
  )
  parent?: RuleConditionGroup;

  // Children groups
  @OneToMany(
    () => RuleConditionGroup,
    group => group.parent
  )
  children!: RuleConditionGroup[];

  @Column({
    type: 'enum',
    enum: RuleLogicalOperator,
  })
  logical_operator!: RuleLogicalOperator;

  @Column({ default: 0 })
  order_index!: number;

  // Leaf conditions inside this group
  @OneToMany(
    () => RuleCondition,
    condition => condition.group,
    { cascade: true }
  )
  conditions!: RuleCondition[];
}