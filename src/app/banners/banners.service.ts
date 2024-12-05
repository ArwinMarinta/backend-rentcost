import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { DataSource } from 'typeorm';
import { Banner } from './entities/banner.entity';

@Injectable()
export class BannersService {
  constructor(private dataSource: DataSource) {}

  async create(createBannerDto: CreateBannerDto, url: string): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Banner)
      .values({
        banner_name: createBannerDto.banner_name,
        image_url: url,
      })
      .orIgnore()
      .returning(['id', 'created_at'])
      .execute();
  }

  async findAll(): Promise<Banner[]> {
    const banners = await this.dataSource.getRepository(Banner).find({
      select: {
        id: true,
        banner_name: true,
        image_url: true,
      },
      order: {
        created_at: 'DESC',
      },
    });

    return banners;
  }

  findOne(id: number) {
    return `This action returns a #${id} banner`;
  }

  update(id: number, updateBannerDto: UpdateBannerDto) {
    return `This action updates a #${id} banner`;
  }

  async remove(id: number): Promise<void> {
    const banner = await this.dataSource
      .getRepository(Banner)
      .findOne({ where: { id: id } });

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    await this.dataSource.getRepository(Banner).delete(banner.id);
  }
}
