import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ClaimsService } from './claims.service';
import { ClaimsController } from './claims.controller';
import { Claim } from './entities/claim.entity';
import { ImportJob } from './entities/import.entity';
import { ClaimsImportProcessor } from './claims-import.processor';
import { DiagnoseTransaction } from './entities/diagnose-transaction.entity';
import { ProceduresTransaction } from './entities/procedures-transaction.entity';
import { ClaimRuleResult } from './entities/claim-rule-result.entity';
import { Overstay } from 'src/overstays/entities/overstay.entity';
import { RuleEngineModule } from 'src/rule-engine/rule-engine.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Claim, ImportJob,DiagnoseTransaction,ProceduresTransaction,Overstay,ClaimRuleResult]),
    BullModule.registerQueue({
      name: 'claims-import',
    }),
    RuleEngineModule
  ],
  controllers: [ClaimsController],
  providers: [ClaimsService, ClaimsImportProcessor],
})
export class ClaimsModule {}
