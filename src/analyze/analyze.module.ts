import { Module } from '@nestjs/common';
import { AnalyzeController } from './analyze.controller';
import { AnalyzeService } from './analyze.service';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportJob } from 'src/claims/entities/import.entity';
import { AnalyzeProcessor } from './analyze.processor';
import { Claim } from 'src/claims/entities/claim.entity';
import { RuleEngineModule } from 'src/rule-engine/rule-engine.module';
import { ClaimsModule } from 'src/claims/claims.module';
import { ClaimRuleResult } from 'src/claims/entities/claim-rule-result.entity';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'analyze',
    }),
    TypeOrmModule.forFeature([ImportJob, Claim,ClaimRuleResult]),
    RuleEngineModule,
    ClaimsModule
  ],
  controllers: [AnalyzeController],
  providers: [AnalyzeService, AnalyzeProcessor]
})
export class AnalyzeModule {}
