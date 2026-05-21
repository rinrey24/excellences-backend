import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put } from '@nestjs/common';
import { DiagnosesService } from './diagnoses.service';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { formatPaginatedResponse } from 'src/common/utils/pagination.util';

@Controller('diagnoses')
export class DiagnosesController {
  constructor(private readonly diagnosesService: DiagnosesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createDiagnosisDto: CreateDiagnosisDto) {
    const diagnosis = await this.diagnosesService.create(createDiagnosisDto);
     return {
      message: RESPONSE_MESSAGE.DIAGNOSE.CREATED,
      data: diagnosis,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '100',
    @Query('search') search: string = '',
  ) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(1000, Math.max(1, parseInt(limit) || 100));
    const [diagnoses, total] = await this.diagnosesService.findAll(pageNum, limitNum, search);
    return formatPaginatedResponse(
        RESPONSE_MESSAGE.DIAGNOSE.FETCHED,
        diagnoses,
        total,
        pageNum,
        limitNum,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const diagnosis = await this.diagnosesService.findOne(id);
    return {
      message: RESPONSE_MESSAGE.DIAGNOSE.FETCHED,
      data: diagnosis,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDiagnosisDto: UpdateDiagnosisDto) {
    const diagnosis = await this.diagnosesService.update(id, updateDiagnosisDto);
    return {
      message: RESPONSE_MESSAGE.DIAGNOSE.UPDATED,
      data: diagnosis,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const diagnosis = await this.diagnosesService.remove(id);
    return {
      message: RESPONSE_MESSAGE.DIAGNOSE.DELETED,
      data: diagnosis,
    };
  }
}
