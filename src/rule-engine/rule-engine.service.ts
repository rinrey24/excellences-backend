import { Injectable } from "@nestjs/common";
import { RulesService } from "src/rules/rules.service";
import { TreeBuilder } from "./complier/tree.builder";
import { GroupEvaluator } from "./evaluators/group.evaluator";
import { ClaimRuleResult } from "src/claims/entities/claim-rule-result.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class RuleEngineService {

  constructor(
    private readonly rulesService: RulesService,
    private readonly treeBuilder: TreeBuilder,
    private readonly groupEvaluator: GroupEvaluator,
    @InjectRepository(ClaimRuleResult)
    private readonly resultRepo: Repository<ClaimRuleResult>,
  ) {}

  async evaluateBatch(claims: any[], importJobId: string) {

    const rules = await this.rulesService.getActiveRules();

    for (const rule of rules) {

      const tree = this.treeBuilder.build(rule.condition_groups);

      for (const claim of claims) {

        const normalized = this.normalizeClaim(claim);

        const matched = this.groupEvaluator.evaluate(
          tree,
          normalized,
        );

        if (matched) {
          await this.resultRepo.insert({
            import_job_id: importJobId,
            claim: claim.id,
            rule: rule.id as any,
            triggered: true,
            score_generated: rule.base_score,
            message_generated: rule.name,
            evaluated_at: new Date(),
            // matched: true,
          });
        }
      }
    }
  }

  private normalizeClaim(claim: any) {
    return {
      ...claim,
      procedure_codes: claim.proclist
        ? claim.proclist.split(';')
        : [],
      diagnosis_code: claim.diaglist
        ? claim.diaglist.split(';')[0]
        : null,
    };
  }
}