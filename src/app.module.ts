import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ClaimsModule } from './claims/claims.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { RulesModule } from './rules/rules.module';
import { OverstaysModule } from './overstays/overstays.module';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './common/logger/winston.config';
import { DiagnosesModule } from './diagnoses/diagnoses.module';
import { ProceduresModule } from './procedures/procedures.module';
import { RuleEngineModule } from './rule-engine/rule-engine.module';
import { AnalyzeModule } from './analyze/analyze.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CmgsModule } from './cmgs/cmgs.module';
import { CaseTypesModule } from './case_types/case_types.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    WinstonModule.forRoot(winstonLoggerOptions),

    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow('DB_HOST'),
        port: config.getOrThrow('DB_PORT'),
        username: config.getOrThrow('DB_USERNAME'),
        password: config.getOrThrow('DB_PASSWORD'),
        database: config.getOrThrow('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    UsersModule,

    AuthModule,

    ClaimsModule,

    HospitalsModule,

    RulesModule,

    OverstaysModule,

    DiagnosesModule,

    ProceduresModule,

    RuleEngineModule,

    AnalyzeModule,

    DashboardModule,

    CmgsModule,

    CaseTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
