import { Injectable } from "@nestjs/common";
import { RuleConditionGroup } from "src/rules/entities/rule-condition-group.entity";

@Injectable()
export class TreeBuilder {

  build(groups: RuleConditionGroup[]): RuleConditionGroup {

    if (!groups.length) {
      throw new Error('No condition groups');
    }

    const map = new Map<string, RuleConditionGroup>();

    groups.forEach(g => {
      map.set(g.id, { ...g, children: [] });
    });

    let root: RuleConditionGroup | null = null;

    groups.forEach(g => {
      const current = map.get(g.id);

      if (!g.parent) {
        if (root) {
          throw new Error('Multiple root groups detected');
        }
        root = current!;
      } else {
        const parent = map.get(g.parent.id);
        if (!parent) {
          throw new Error('Invalid parent reference');
        }
        parent.children.push(current!);
      }
    });

    if (!root) {
      throw new Error('Root not found');
    }

    return root;
  }
}
