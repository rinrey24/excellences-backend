import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { OverstaysService } from './overstays.service';
import { CreateOverstayDto } from './dto/create-overstay.dto';
import { UpdateOverstayDto } from './dto/update-overstay.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('overstays')
export class OverstaysController {
  constructor(private readonly overstaysService: OverstaysService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOverstayDto: CreateOverstayDto) {
    return this.overstaysService.create(createOverstayDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.overstaysService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.overstaysService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateOverstayDto: UpdateOverstayDto) {
    return this.overstaysService.update(id, updateOverstayDto);
  }

}
