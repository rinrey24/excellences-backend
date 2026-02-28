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
  UseGuards,
  Delete
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { Multer } from 'multer';
import { response } from 'express';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { formatPaginatedResponse } from 'src/common/utils/pagination.util';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importInacbg(@UploadedFile() file: Express.Multer.File) {
    const jobId = await this.claimsService.queueFileImport(file);
    return {
      message: RESPONSE_MESSAGE.JOB.QUEUED,
      data: { import_job_id: jobId },
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('import/status/:jobId')
  async getImportStatus(@Param('jobId') jobId: string) {
    const status = await this.claimsService.getJobStatus(jobId);
    return {
      message: RESPONSE_MESSAGE.JOB.FETCHED,
      data: status,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('import')
  async getImportJobs(    
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '100',
    //@Query('search') search: string = '',
  ) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(1000, Math.max(1, parseInt(limit) || 100));
    const [importJob, total] = await this.claimsService.getImportJobs(pageNum, limitNum) 
    return formatPaginatedResponse(
      RESPONSE_MESSAGE.JOB.FETCHED,
      importJob,
      total,
      pageNum,
      limitNum,
    )
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
    @Query('limit') limit: string = '100',
    @Query('search') search: string = '',
  ) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(1000, Math.max(1, parseInt(limit) || 100));
    const [claims, total] = await this.claimsService.getAllClaims(pageNum, limitNum, search);
    return formatPaginatedResponse(
      RESPONSE_MESSAGE.CLAIM.FETCHED,
      claims,
      total,
      pageNum,
      limitNum,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:import_job_id')
  async getClaimByJobId(
    @Param('import_job_id') import_job_id: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '100',
    @Query('search') search: string = '',
  ) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(1000, Math.max(1, parseInt(limit) || 100));
    const [claims, total] = await this.claimsService.getClaimByJobId(import_job_id, pageNum, limitNum, search);
    return formatPaginatedResponse(
      RESPONSE_MESSAGE.CLAIM.FETCHED,
      claims,
      total,
      pageNum,
      limitNum,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':import_job_id')
  async deleteClaimByJobId(@Param('import_job_id') import_job_id: string) {
    const result = await this.claimsService.deleteClaimByJobId(import_job_id);
    return {
      message: RESPONSE_MESSAGE.CLAIM.DELETED,
      data: result,
    };
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('analyze/:import_job_id')
  // async getAnalyzedClaim(
  //   @Param('import_job_id') import_job_id: string,
  //   @Query('page') page: string = '1',
  //   @Query('limit') limit: string = '100',
  //   @Query('group_results') group_results: string = 'false'
  // ) {
  //   const pageNum = Math.max(1, parseInt(page) || 1);
  //   const limitNum = Math.min(1000, Math.max(1, parseInt(limit) || 100));
  //   const [claims, total] = await this.claimsService.getAnalyzedClaim(import_job_id, pageNum, limitNum, group_results ); 
  //   return formatPaginatedResponse(
  //     RESPONSE_MESSAGE.CLAIM.FETCHED,
  //     claims,
  //     total,
  //     pageNum,
  //     limitNum,
  //   );
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post('analyze')
  // async analyzeClaim(@Body('import_job_id') import_job_id: any) {
  //   const result = await this.claimsService.analyzeClaim(import_job_id);
  //   return {
  //     message: RESPONSE_MESSAGE.CLAIM.ANALYZED,
  //     data: result,
  //   };
  // }

}
