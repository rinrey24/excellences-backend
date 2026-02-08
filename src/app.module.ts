import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule,ConfigService  } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
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
      synchronize: true,
  }),
}),

    UsersModule,

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
