import { forwardRef, Module } from '@nestjs/common';
import { OverstaysService } from './overstays.service';
import { OverstaysController } from './overstays.controller';
import { Overstay } from './entities/overstay.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Overstay]),
  forwardRef(() => AuthModule)
],
  controllers: [OverstaysController],
  providers: [OverstaysService],
  exports: [OverstaysService],
})
export class OverstaysModule {}
