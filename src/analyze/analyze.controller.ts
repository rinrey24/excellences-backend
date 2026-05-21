import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { formatPaginatedResponse } from 'src/common/utils/pagination.util';

@Controller('analyze')
export class AnalyzeController {
    constructor(private readonly analyzeService: AnalyzeService) {}

@UseGuards(JwtAuthGuard)
@Post()
async analyze(
    @Body('import_job_id') importJobId: string,) {
    await this.analyzeService.enqueueAnalysis(importJobId);

    return {
        message: RESPONSE_MESSAGE.CLAIM.ANALYZED,
        data: { importJobId }
    }
}

  @UseGuards(JwtAuthGuard)
  @Get(':import_job_id')
  async getAnalyzedClaim(
    @Param('import_job_id') import_job_id: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '100',
    @Query('category') category: string = 'false'
  ) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(1000, Math.max(1, parseInt(limit) || 100));
    const [claims, total] = await this.analyzeService.getAnalyzedClaim(import_job_id, pageNum, limitNum, category ); 
    return formatPaginatedResponse(
      RESPONSE_MESSAGE.CLAIM.FETCHED,
      claims,
      total,
      pageNum,
      limitNum,
    );
  }

}
