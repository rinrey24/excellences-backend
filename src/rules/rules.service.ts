import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rule } from './entities/rule.entity';
import { Repository } from 'typeorm';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rule)
    private ruleRepo: Repository<Rule>,
  ) {}

  async create(createRuleDto: CreateRuleDto) {
    const rule = this.ruleRepo.create(createRuleDto);
    if (typeof createRuleDto.expression !== 'object') {
      throw new BadRequestException('Expression harus JSON object');
    }
    await this.ruleRepo.save(rule);

        return {
        message: RESPONSE_MESSAGE.RULE.CREATED,
        data: rule,
      };
  }

  async findAll() {
        const rules = await this.ruleRepo.find();
        return {
          message: RESPONSE_MESSAGE.RULE.FETCHED,
          data: rules,
        };
  }

  async findOne(id: string) {
    const rule = await this.ruleRepo.findOneBy({ id });
    if (!rule) {
      throw new Error(RESPONSE_MESSAGE.RULE.NOT_FOUND);
    }
    return {
      message: RESPONSE_MESSAGE.RULE.FETCHED,
      data: rule,
    };
  }

  async update(id: string, updateRuleDto: UpdateRuleDto) {
    const rule = await this.ruleRepo.preload({
      id,
      ...updateRuleDto,
    });
    if (!rule) {
      throw new Error(RESPONSE_MESSAGE.RULE.NOT_FOUND);
    }
      if (typeof updateRuleDto.expression !== 'object') {
      throw new BadRequestException('Expression harus JSON object');
    }
    await this.ruleRepo.save(rule);
    return {
      message: RESPONSE_MESSAGE.RULE.UPDATED,
      data: rule,
    };
  }

}
