import { forwardRef, Module } from '@nestjs/common';
import { DiagnosesService } from './diagnoses.service';
import { DiagnosesController } from './diagnoses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnosis } from './entities/diagnosis.entity';
import { DiagnoseTransaction } from 'src/claims/entities/diagnose-transaction.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ TypeOrmModule.forFeature([Diagnosis]),
  forwardRef(() => AuthModule),],
  controllers: [DiagnosesController],
  providers: [DiagnosesService],
  exports: [DiagnosesService]
})
export class DiagnosesModule {}
