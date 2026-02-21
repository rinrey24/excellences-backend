import {
  IsString,
  IsEnum,
  IsNumber,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RuleStatus } from 'src/common/enums/rule-status.enum';
import { ConditionTreeDto } from './condition-tree.dto';
import { ActionDto } from './action.dto';
import { CreateRuleDto } from './create-rule.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateRuleDto extends PartialType(CreateRuleDto) {

  @IsString()
  name!: string;

  @IsString()
  category!: string;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  severity_level!: 'LOW' | 'MEDIUM' | 'HIGH';

  @IsNumber()
  base_score!: number;

  @IsOptional()
  effective_start_date?: Date;
  
  @IsOptional()
  description?: string;

  @ValidateNested()
  @Type(() => ConditionTreeDto)
  condition_tree!: ConditionTreeDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActionDto)
  actions!: ActionDto[];
}