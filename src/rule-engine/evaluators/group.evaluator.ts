import { Injectable } from "@nestjs/common";
import { RuleConditionGroup } from "src/rules/entities/rule-condition-group.entity";
import { ConditionEvaluator } from "./condition.evaluator";

@Injectable()
export class GroupEvaluator {

  constructor(
    private readonly conditionEvaluator: ConditionEvaluator,
  ) {}

  evaluate(group: RuleConditionGroup, claim: any): boolean {

    const conditionResults =
      group.conditions?.map(cond =>
        this.conditionEvaluator.evaluate(cond, claim),
      ) || [];

    const childrenResults =
      group.children?.map(child =>
        this.evaluate(child, claim),
      ) || [];

    const all = [...conditionResults, ...childrenResults];

    if (group.logical_operator === 'AND') {
      return all.every(Boolean);
    }

    if (group.logical_operator === 'OR') {
      return all.some(Boolean);
    }

    return false;
  }
}