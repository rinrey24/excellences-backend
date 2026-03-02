import { forwardRef, Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ClaimSummaryView } from 'src/claims/entities/view/claim-summary.view';
import { RekapSeverityView } from 'src/claims/entities/view/rekap-severity.view';
import { RekapDischargeView } from 'src/claims/entities/view/rekap-discharge.view';

@Module({
  imports: [ TypeOrmModule.forFeature([
    ClaimSummaryView,
    RekapSeverityView,
    RekapDischargeView,
  ]),
  forwardRef(() => AuthModule),],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
