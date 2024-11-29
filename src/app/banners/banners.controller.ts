import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { AuthGuard } from '../auths/auth.guard';
import { createHttpException } from 'src/common/middlewares/utils/http-exception.util';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Post()
  create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannersService.create(createBannerDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    try {
      const categories = await this.bannersService.findAll();
      return {
        message: 'Succesfully get banner',
        data: categories,
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
    return this.bannersService.update(+id, updateBannerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannersService.remove(+id);
  }
}
