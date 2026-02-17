import { Module } from '@nestjs/common';
import { ProceduresService } from './procedures.service';
import { ProceduresController } from './procedures.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Procedure } from './entities/procedure.entity';
import { ProceduresTransaction } from 'src/claims/entities/procedures-transaction.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Procedure,ProceduresTransaction]) ],
  controllers: [ProceduresController],
  providers: [ProceduresService],
  exports: [ProceduresService],
})
export class ProceduresModule {}
