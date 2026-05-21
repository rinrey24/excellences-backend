import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rule } from './entities/rule.entity';
import { Repository } from 'typeorm';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { ConditionTreeDto } from './dto/condition-tree.dto';
import { RuleConditionGroup } from './entities/rule-condition-group.entity';
import { RuleCondition } from './entities/rule-condition.entity';
import { RuleAction } from './entities/rule-action.entity';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { RuleStatus } from 'src/common/enums/rule-status.enum';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rule)
    private ruleRepo: Repository<Rule>,
    @InjectRepository(RuleConditionGroup)
    private groupRepo: Repository<RuleConditionGroup>,
    @InjectRepository(RuleCondition)
    private conditionRepo: Repository<RuleCondition>,
    @InjectRepository(RuleAction)
    private ruleActionRepo: Repository<RuleAction>
  ) {}

  async createRule(dto: CreateRuleDto) {
    const rule = this.ruleRepo.create({
      name: dto.name,
      category: dto.category,
      severity_level: dto.severity_level,
      base_score: dto.base_score,
      effective_start_date: dto.effective_start_date,
      description: dto.description,
      status: RuleStatus.DRAFT, // Default to DRAFT
    });

    await this.ruleRepo.save(rule);

    //save condition tree
    await this.saveCondotionTreeRecursive(
      dto.condition_tree,
      rule,
      null,
    );

    //save actions
    for (const action of dto.actions){
      const newAction = this.ruleActionRepo.create({
        ...action,
        rule,
      });

      await this.ruleActionRepo.save(newAction);
    }

    return rule;

  }

  private async saveCondotionTreeRecursive(tree: ConditionTreeDto,rule: Rule,parentGroup?: RuleConditionGroup | null){
    const group = this.groupRepo.create({
      rule,
      parent: parentGroup ?? undefined,
      logical_operator: tree.logical_operator,
    });

    await this.groupRepo.save(group);

    //save conditions
    if (tree.conditions){
      for (const cond of tree.conditions){
        const condition = this.conditionRepo.create({
          ...cond,
          rule,
          group,
        });
        await this.conditionRepo.save(condition);
      }
    }

    //recursive for child groups
    if (tree.groups){
      for (const child of tree.groups){
        await this.saveCondotionTreeRecursive(
          child,
          rule,
          group,
        )
      }
    }

  }

  async activateRule(id: string){
    const rule = await this.ruleRepo.findOneBy({ id });

    if (!rule){
      throw new BusinessException(RESPONSE_MESSAGE.RULE.NOT_FOUND)
    }

    rule.status = RuleStatus.ACTIVE;

    return this.ruleRepo.save(rule);
  }

  async getRuleWithTree(id: string) {
    const rule = await this.ruleRepo.findOne({
      where: { id },
      relations: [
        'condition_groups',
        'condition_groups.parent',
        'condition_groups.conditions',
        'actions',
      ],
    });

    if (!rule) {
      throw new BusinessException(RESPONSE_MESSAGE.RULE.NOT_FOUND);
    }


    const tree = this.buildTree(rule?.condition_groups || []);

    return {
      ...rule,
      condition_tree: tree,
    };
  }

  private buildTree(
  groups: RuleConditionGroup[],
  ): RuleConditionGroup {

    if (!groups || groups.length === 0) {
      throw new Error('Rule has no condition groups');
    }

    // Map untuk akses cepat
    const groupMap = new Map<string, RuleConditionGroup>();

    // Clone + reset children array
    groups.forEach(group => {
      groupMap.set(group.id, {
        ...group,
        children: [],
      });
    });

    let root: RuleConditionGroup | undefined;

    groups.forEach(group => {

      const current = groupMap.get(group.id);

      if (!group.parent) {
        // Ini root
        if (root) {
          throw new Error('Multiple root groups detected');
        }

        root = current;
      } else {
        const parent = groupMap.get(group.parent.id);

        if (!parent) {
          throw new Error('Invalid parent group reference');
        }

        parent.children.push(current!);
      }
    });

    if (!root) {
      throw new Error('Root group not found');
    }

    return root;
  }

  async getActiveRules() {
    return this.ruleRepo.find({
      where: {
        status: RuleStatus.ACTIVE,
      },
      relations: ['condition_groups','condition_groups.parent', 'condition_groups.conditions', 'actions'],
    });
  }

  async archiveRule(id: string){
    const rule = await this.ruleRepo.findOneBy({ id });

    if (!rule){
      throw new BusinessException(RESPONSE_MESSAGE.RULE.NOT_FOUND)
    }

    rule.status = RuleStatus.ARCHIVED;

    return this.ruleRepo.save(rule);
  }



}
