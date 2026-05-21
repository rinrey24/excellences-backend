import { IsEnum, IsOptional } from 'class-validator';
import { RuleActionType } from 'src/common/enums/rule-action-type.enum';

export class ActionDto {

  @IsEnum(RuleActionType)
  action_type!: RuleActionType;

  @IsOptional()
  message_template?: string;

  @IsOptional()
  score_override?: number;

  @IsOptional()
  severity_override?: 'LOW' | 'MEDIUM' | 'HIGH';
}