import { Rule } from "src/rules/entities/rule.entity";
import { Entity, ManyToOne, Column } from "typeorm";
import { Claim } from "./claim.entity";
import { BaseEntity } from "src/common/base/base.entity";

@Entity('claim_rule_results')
export class ClaimRuleResult extends BaseEntity {
  @ManyToOne(() => Claim, (claim) => claim.rule_results, {
    onDelete: 'CASCADE',
  })
  claim!: Claim;

  @ManyToOne(() => Rule)
  rule!: Rule;
  
  @Column()
  import_job_id!: string;

  @Column()
  triggered!: boolean;

  @Column({ default: 0 })
  score_generated!: number;

  @Column()
  message_generated!: string;

  @Column({ type: 'timestamp' })
  evaluated_at!: Date;
}
