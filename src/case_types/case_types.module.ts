import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseTypesController } from './case_types.controller';
import { CaseTypesService } from './case_types.service';
import { CaseType } from './entities/case-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CaseType])],
  controllers: [CaseTypesController],
  providers: [CaseTypesService],
  exports: [CaseTypesService],
})
export class CaseTypesModule {}
