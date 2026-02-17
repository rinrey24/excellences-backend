import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { formatPaginatedResponse } from 'src/common/utils/pagination.util';

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createas(@Body() createHospitalDto: CreateHospitalDto) {
    const hospital = await this.hospitalsService.create(createHospitalDto);
    return {
      message: RESPONSE_MESSAGE.HOSPITAL.CREATED,
      data: hospital,
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
    const [hospitals, total] = await this.hospitalsService.findAll(pageNum,limitNum,search);
    return formatPaginatedResponse(
      RESPONSE_MESSAGE.HOSPITAL.FETCHED,
      hospitals,
      total,
      pageNum,
      limitNum,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') kode_rs: string) {
    const hospital = await this.hospitalsService.findOne(kode_rs);
    return {
      message: RESPONSE_MESSAGE.HOSPITAL.FETCHED,
      data: hospital,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') kode_rs: string, @Body() updateHospitalDto: UpdateHospitalDto) {
    const hospital = await this.hospitalsService.update(kode_rs, updateHospitalDto);
    return {
      message: RESPONSE_MESSAGE.HOSPITAL.UPDATED,
      data: hospital,
    };
  }

}
