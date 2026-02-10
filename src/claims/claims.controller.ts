import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
  Get,
  Param,
  Query,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { Multer } from 'multer';
import { response } from 'express';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importInacbg(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(RESPONSE_MESSAGE.VALIDATION.FILE_NOT_FOUND);
    }

    return this.claimsService.queueFileImport(file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('import/status/:jobId')
  async getImportStatus(@Param('jobId') jobId: string) {
    return this.claimsService.getJobStatus(jobId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('import')
  async getImportJobs(    
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '100'
  ) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(1000, Math.max(1, parseInt(limit) || 100));
    return await this.claimsService.getImportJobs(pageNum, limitNum);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('import/:id')
  async getImportJobsById(@Param('id') id: string) {
    return await this.claimsService.getImportJobsById(id);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllClaims(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '100'
  ) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(1000, Math.max(1, parseInt(limit) || 100));
    return await this.claimsService.getAllClaims(pageNum, limitNum);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':import_job_id')
  async getClaimByJobId(
    @Param('import_job_id') import_job_id: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '100'
  ) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(1000, Math.max(1, parseInt(limit) || 100));
    return this.claimsService.getClaimByJobId(import_job_id, pageNum, limitNum);
  }

}
