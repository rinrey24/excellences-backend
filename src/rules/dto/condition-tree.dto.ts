import {
  IsEnum,
  IsArray,
  IsOptional,
  ValidateNested,
  IsString,
  IsIn,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RuleLogicalOperator } from 'src/common/enums/rule-logical-operator.enum';
import { RuleOperator } from 'src/common/enums/rule-operator.enum';

export class ConditionDto {

  @IsEnum(RuleOperator)
  operator!: RuleOperator;

  @IsString()
  @IsNotEmpty()
  field_name!: string;

  @IsString()
  @IsNotEmpty()
  value!: string;

  @IsIn(['STRING', 'NUMBER', 'DATE', 'ARRAY'])
  @IsOptional()
  value_type?: 'STRING' | 'NUMBER' | 'DATE' | 'ARRAY';
}

export class ConditionTreeDto {

  @IsEnum(RuleLogicalOperator)
  logical_operator!: RuleLogicalOperator;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConditionDto)
  @IsOptional()
  conditions?: ConditionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConditionTreeDto)
  @IsOptional()
  groups?: ConditionTreeDto[];
}
