import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [JwtModule],
})
export class CategoriesModule {}
