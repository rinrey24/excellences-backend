import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { formatPaginatedResponse } from 'src/common/utils/pagination.util';
import { CreateDischargeDto } from './dto/create-discharge.dto';
import { UpdateDischargeDto } from './dto/update-discharge.dto';
import { DischargesService } from './discharges.service';

@Controller('discharges')
export class DischargesController {
  constructor(private readonly dischargesService: DischargesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createDischargeDto: CreateDischargeDto) {
    const discharge = await this.dischargesService.create(createDischargeDto);
    return {
      message: RESPONSE_MESSAGE.DISCHARGE.CREATED,
      data: discharge,
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
    const [discharges, total] = await this.dischargesService.findAll(
      pageNum,
      limitNum,
      search,
    );
    return formatPaginatedResponse(
      RESPONSE_MESSAGE.DISCHARGE.FETCHED,
      discharges,
      total,
      pageNum,
      limitNum,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const discharge = await this.dischargesService.findOne(id);
    return {
      message: RESPONSE_MESSAGE.DISCHARGE.FETCHED,
      data: discharge,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDischargeDto: UpdateDischargeDto,
  ) {
    const discharge = await this.dischargesService.update(id, updateDischargeDto);
    return {
      message: RESPONSE_MESSAGE.DISCHARGE.UPDATED,
      data: discharge,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const discharge = await this.dischargesService.remove(id);
    return {
      message: RESPONSE_MESSAGE.DISCHARGE.DELETED,
      data: discharge,
    };
  }
}
