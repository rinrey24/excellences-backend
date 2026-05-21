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
import { CaseTypesService } from './case_types.service';
import { CreateCaseTypeDto } from './dto/create-case-type.dto';
import { UpdateCaseTypeDto } from './dto/update-case-type.dto';

@Controller('case-types')
export class CaseTypesController {
  constructor(private readonly caseTypesService: CaseTypesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCaseTypeDto: CreateCaseTypeDto) {
    const caseType = await this.caseTypesService.create(createCaseTypeDto);
    return {
      message: RESPONSE_MESSAGE.CASE_TYPE.CREATED,
      data: caseType,
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
    const [caseTypes, total] = await this.caseTypesService.findAll(
      pageNum,
      limitNum,
      search,
    );

    return formatPaginatedResponse(
      RESPONSE_MESSAGE.CASE_TYPE.FETCHED,
      caseTypes,
      total,
      pageNum,
      limitNum,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const caseType = await this.caseTypesService.findOne(id);
    return {
      message: RESPONSE_MESSAGE.CASE_TYPE.FETCHED,
      data: caseType,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCaseTypeDto: UpdateCaseTypeDto,
  ) {
    const caseType = await this.caseTypesService.update(id, updateCaseTypeDto);
    return {
      message: RESPONSE_MESSAGE.CASE_TYPE.UPDATED,
      data: caseType,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const caseType = await this.caseTypesService.remove(id);
    return {
      message: RESPONSE_MESSAGE.CASE_TYPE.DELETED,
      data: caseType,
    };
  }
}
