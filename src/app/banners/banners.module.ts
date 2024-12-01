import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { JwtModule } from '@nestjs/jwt';
import { ImageKitService } from 'src/utils/imagekit.service';

@Module({
  controllers: [BannersController],
  providers: [BannersService, ImageKitService],
  imports: [JwtModule],
})
export class BannersModule {}
