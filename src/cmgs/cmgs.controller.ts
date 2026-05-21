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
import { CmgsService } from './cmgs.service';
import { CreateCmgDto } from './dto/create-cmg.dto';
import { UpdateCmgDto } from './dto/update-cmg.dto';

@Controller('cmgs')
export class CmgsController {
  constructor(private readonly cmgsService: CmgsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCmgDto: CreateCmgDto) {
    const cmg = await this.cmgsService.create(createCmgDto);
    return {
      message: RESPONSE_MESSAGE.CMG.CREATED,
      data: cmg,
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
    const [cmgs, total] = await this.cmgsService.findAll(
      pageNum,
      limitNum,
      search,
    );

    return formatPaginatedResponse(
      RESPONSE_MESSAGE.CMG.FETCHED,
      cmgs,
      total,
      pageNum,
      limitNum,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cmg = await this.cmgsService.findOne(id);
    return {
      message: RESPONSE_MESSAGE.CMG.FETCHED,
      data: cmg,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCmgDto: UpdateCmgDto) {
    const cmg = await this.cmgsService.update(id, updateCmgDto);
    return {
      message: RESPONSE_MESSAGE.CMG.UPDATED,
      data: cmg,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const cmg = await this.cmgsService.remove(id);
    return {
      message: RESPONSE_MESSAGE.CMG.DELETED,
      data: cmg,
    };
  }
}
