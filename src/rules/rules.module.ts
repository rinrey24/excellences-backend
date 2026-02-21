import { forwardRef, Module } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';
import { Rule } from './entities/rule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RuleCondition } from './entities/rule-condition.entity';
import { RuleAction } from './entities/rule-action.entity';
import { RuleConditionGroup } from './entities/rule-condition-group.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Rule,RuleCondition,RuleAction,RuleConditionGroup]) ,
  forwardRef(() => AuthModule)
  ],
  controllers: [RulesController],
  providers: [RulesService],
  exports: [RulesService],
})
export class RulesModule {}
