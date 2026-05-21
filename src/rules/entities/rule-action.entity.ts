// rule-action.entity.ts
import {
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Rule } from './rule.entity';
import { RuleActionType } from 'src/common/enums/rule-action-type.enum';

@Entity('rule_actions')
export class RuleAction extends BaseEntity {

  @ManyToOne(
    () => Rule,
    rule => rule.actions,
    { onDelete: 'CASCADE' }
  )
  rule!: Rule;

  @Column({
    type: 'enum',
    enum: RuleActionType,
  })
  action_type!: RuleActionType;

  @Column({ type: 'text', nullable: true })
  message_template?: string;

  @Column({ nullable: true })
  score_override?: number;

  @Column({ nullable: true })
  severity_override?: 'LOW' | 'MEDIUM' | 'HIGH';
}