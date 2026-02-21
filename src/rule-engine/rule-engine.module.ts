import { Module } from '@nestjs/common';
import { RuleEngineService } from './rule-engine.service';
import { RuleEngineController } from './rule-engine.controller';
import { RulesModule } from 'src/rules/rules.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaimRuleResult } from 'src/claims/entities/claim-rule-result.entity';
import { ConditionEvaluator } from './evaluators/condition.evaluator';
import { GroupEvaluator } from './evaluators/group.evaluator';
import { TreeBuilder } from './complier/tree.builder';

@Module({
  imports: [
    RulesModule,
    TypeOrmModule.forFeature([ClaimRuleResult]),
  ],
  controllers: [RuleEngineController],
  providers: [RuleEngineService, TreeBuilder, GroupEvaluator, ConditionEvaluator],
  exports: [RuleEngineService],
})
export class RuleEngineModule {}
