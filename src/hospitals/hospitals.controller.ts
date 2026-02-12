import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createHospitalDto: CreateHospitalDto) {
    return this.hospitalsService.create(createHospitalDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.hospitalsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') kode_rs: string) {
    return this.hospitalsService.findOne(kode_rs);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') kode_rs: string, @Body() updateHospitalDto: UpdateHospitalDto) {
    return this.hospitalsService.update(kode_rs, updateHospitalDto);
  }

}
