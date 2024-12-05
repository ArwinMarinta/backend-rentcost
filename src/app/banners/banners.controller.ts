import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { AuthGuard } from '../auths/auth.guard';
import { createHttpException } from 'src/common/middlewares/utils/http-exception.util';
import { ImageKitService } from 'src/utils/imagekit.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('banners')
export class BannersController {
  constructor(
    private readonly bannersService: BannersService,
    private readonly fileService: ImageKitService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image_url'))
  async create(
    @UploadedFile() image_url: Express.Multer.File,
    @Body()
    createBannerDto: CreateBannerDto,
  ) {
    const uploadResult = await this.fileService.uploadImage(image_url);

    await this.bannersService.create(createBannerDto, uploadResult.url);

    return {
      message: 'Successfully create Banner',
    };
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
  remove(@Param('id') id: number) {
    this.bannersService.remove(id);
    return {
      message: 'Succesfully get banner',
    };
  }
}
