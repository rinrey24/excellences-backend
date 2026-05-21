import { Injectable } from "@nestjs/common";
import { RuleCondition } from "src/rules/entities/rule-condition.entity";

@Injectable()
export class ConditionEvaluator {

  evaluate(condition: RuleCondition, claim: any): boolean {

    const value = claim[condition.field_name];

    switch (condition.operator) {

      case 'EQUAL':
        return value == condition.value;

      case 'NOT_EQUAL':
        return value != condition.value;

      case 'GREATER_THAN':
        return Number(value) > Number(condition.value);

      case 'LESS_THAN':
        return Number(value) < Number(condition.value);

      case 'CONTAINS':
        return Array.isArray(value)
          ? value.includes(condition.value)
          : String(value).includes(condition.value);

      case 'NOT_CONTAINS':
        return Array.isArray(value)
          ? !value.includes(condition.value)
          : !String(value).includes(condition.value);

      default:
        return false;
    }
  }
}