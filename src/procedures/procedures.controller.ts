import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put } from '@nestjs/common';
import { ProceduresService } from './procedures.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { formatPaginatedResponse } from 'src/common/utils/pagination.util';

@Controller('procedures')
export class ProceduresController {
  constructor(private readonly proceduresService: ProceduresService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createProcedureDto: CreateProcedureDto) {
    const procedure = await this.proceduresService.create(createProcedureDto);
    return {
      message: RESPONSE_MESSAGE.PROCEDURE.CREATED,
      data: procedure,
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
    const [procedures, total] = await this.proceduresService.findAll(limitNum, pageNum, search);
    return formatPaginatedResponse(
      RESPONSE_MESSAGE.PROCEDURE.FETCHED,
      procedures,
      total,
      pageNum,
      limitNum,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const procedure = await this.proceduresService.findOne(id);
    return {
      message: RESPONSE_MESSAGE.PROCEDURE.FETCHED,
      data: procedure,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProcedureDto: UpdateProcedureDto) {
    const procedure = await this.proceduresService.update(id, updateProcedureDto);
    return {
      message: RESPONSE_MESSAGE.PROCEDURE.UPDATED,
      data: procedure,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
   async remove(@Param('id') id: string) {
    const procedure = await this.proceduresService.remove(id);
    return {
      message: RESPONSE_MESSAGE.PROCEDURE.DELETED,
      data: procedure,
    };
  }
}
