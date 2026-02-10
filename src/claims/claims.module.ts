import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ClaimsService } from './claims.service';
import { ClaimsController } from './claims.controller';
import { Claim } from './entities/claim.entity';
import { ImportJob } from './entities/import.entity';
import { ClaimsImportProcessor } from './claims-import.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Claim, ImportJob]),
    BullModule.registerQueue({
      name: 'claims-import',
    }),
  ],
  controllers: [ClaimsController],
  providers: [ClaimsService, ClaimsImportProcessor],
})
export class ClaimsModule {}
