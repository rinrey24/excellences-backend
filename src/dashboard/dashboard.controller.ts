import { BadRequestException, Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';

@Controller('dashboard')
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService
    ) {}

//   @UseGuards(JwtAuthGuard)
//   @Post('/summary-all')
//   async getSummary(
//     @Body() body: { import_job_id?: string; importJobId?: string } | string,
//     @Query('import_job_id') importJobIdFromQuery?: string,
//   ) {
//     const importJobIdRaw =
//       typeof body === 'string'
//         ? body
//         : body.import_job_id ?? body.importJobId ?? importJobIdFromQuery;

//     const importJobId = importJobIdRaw?.trim();

//     if (!importJobId) {
//       throw new BadRequestException('import_job_id is required');
//     }

//     const data = await this.dashboardService.getSummary(importJobId)
//     return {
//         message: RESPONSE_MESSAGE.DASHBOARD.FETCHED,
//         data: data
//     }
//   }
  @UseGuards(JwtAuthGuard)
  @Get('/summary-all/:import_job_id')
    async getSummary(@Param('import_job_id') import_job_id: string) {
    const data = await this.dashboardService.getRekapSummary(import_job_id)
    return {
        message: RESPONSE_MESSAGE.DASHBOARD.FETCHED,
        data: data
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('/severity-level/:import_job_id')
    async getRekapSeverity(@Param('import_job_id') import_job_id: string) {
    const data = await this.dashboardService.getRekapSeverity(import_job_id)
    return {
        message: RESPONSE_MESSAGE.DASHBOARD.FETCHED,
        data: data
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/discharge/:import_job_id')
    async getRekapDischarge(@Param('import_job_id') import_job_id: string) {
    const data = await this.dashboardService.getRekapDischarge(import_job_id)
    return {
        message: RESPONSE_MESSAGE.DASHBOARD.FETCHED,
        data: data
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('/case-type/:import_job_id')
    async getRekapTipeKasus(@Param('import_job_id') import_job_id: string) {
    const data = await this.dashboardService.getRekapTipeKasus(import_job_id)
    return {
        message: RESPONSE_MESSAGE.DASHBOARD.FETCHED,
        data: data
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('/cmg/:import_job_id')
    async getRekapCMG(@Param('import_job_id') import_job_id: string) {
    const data = await this.dashboardService.getRekapCMG(import_job_id)
    return {
        message: RESPONSE_MESSAGE.DASHBOARD.FETCHED,
        data: data
    }
  }


}
