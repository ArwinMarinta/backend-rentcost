import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [BannersController],
  providers: [BannersService],
  imports: [JwtModule],
})
export class BannersModule {}
