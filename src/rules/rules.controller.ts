import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';

@Controller('rules')
export class RulesController {

  constructor(
    private readonly rulesService: RulesService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateRuleDto) {
    const rule = await this.rulesService.createRule(dto);
    return {
      message: RESPONSE_MESSAGE.RULE.CREATED,
      data:rule,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/:action')
  async changeStatus(@Param('id') id: string, @Param('action') action: string) {
    let rule;
    if (action === 'activate') {
      rule = await this.rulesService.activateRule(id);
      return {
        message: RESPONSE_MESSAGE.RULE.ACTIVATED,
        data:rule,
      }
    } else if (action === 'archive') {
      rule = await this.rulesService.archiveRule(id);
      return {
        message: RESPONSE_MESSAGE.RULE.ARCHIVED,
        data:rule,
      }
    }
    throw new Error('Invalid action. Must be either "activate" or "archive".');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const rule = await this.rulesService.getRuleWithTree(id);
    return {
      message: RESPONSE_MESSAGE.RULE.FETCHED,
      data:rule,
    }
  }

  
}