import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discharge } from './entities/discharge.entity';
import { DischargesController } from './discharges.controller';
import { DischargesService } from './discharges.service';

@Module({
  imports: [TypeOrmModule.forFeature([Discharge])],
  controllers: [DischargesController],
  providers: [DischargesService],
  exports: [DischargesService],
})
export class DischargesModule {}
