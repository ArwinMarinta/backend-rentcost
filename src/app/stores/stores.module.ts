import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [StoresController],
  imports: [JwtModule],
  providers: [StoresService],
})
export class StoresModule {}
