import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmgsController } from './cmgs.controller';
import { CmgsService } from './cmgs.service';
import { Cmg } from './entities/cmg.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cmg])],
  controllers: [CmgsController],
  providers: [CmgsService],
  exports: [CmgsService],
})
export class CmgsModule {}
