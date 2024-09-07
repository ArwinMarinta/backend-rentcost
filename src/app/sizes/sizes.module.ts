import { Module } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { SizesController } from './sizes.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [SizesController],
  providers: [SizesService],
  imports: [JwtModule],
})
export class SizesModule {}
