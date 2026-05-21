import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { OverstaysService } from './overstays.service';
import { CreateOverstayDto } from './dto/create-overstay.dto';
import { UpdateOverstayDto } from './dto/update-overstay.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { format } from 'path';
import { formatPaginatedResponse } from 'src/common/utils/pagination.util';

@Controller('overstays')
export class OverstaysController {
  constructor(private readonly overstaysService: OverstaysService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createOverstayDto: CreateOverstayDto) {
    const overstay = await this.overstaysService.create(createOverstayDto);
    return {
      message: RESPONSE_MESSAGE.OVERSTAY.CREATED,
      data: overstay,
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
    const [overstays, total] = await this.overstaysService.findAll(pageNum, limitNum, search);
    return formatPaginatedResponse(
        RESPONSE_MESSAGE.OVERSTAY.FETCHED,
        overstays,
        total,
        pageNum,
        limitNum,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const overstay = await this.overstaysService.findOne(id);
    return {
      message: RESPONSE_MESSAGE.OVERSTAY.FETCHED,
      data: overstay,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateOverstayDto: UpdateOverstayDto) {
    const overstay = await this.overstaysService.update(id, updateOverstayDto);
    return {
      message: RESPONSE_MESSAGE.OVERSTAY.UPDATED,
      data: overstay,
    };
  }

}
