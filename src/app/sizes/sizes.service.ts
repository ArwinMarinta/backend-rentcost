import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { DataSource } from 'typeorm';
import { Size } from './entities/size.entity';

@Injectable()
export class SizesService {
  constructor(private dataSource: DataSource) {}
  async create(createSizeDto: CreateSizeDto): Promise<void> {
    const size = await this.dataSource
      .getRepository(Size)
      .findOne({ where: { size_name: createSizeDto.size_name } });

    if (size) {
      throw new ConflictException('Size already');
    }

    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Size)
      .values({ ...createSizeDto })
      .execute();
  }

  findAll() {
    return `This action returns all sizes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} size`;
  }

  // update(id: number, updateSizeDto: UpdateSizeDto) {
  //   return `This action updates a #${id} size`;
  // }

  remove(id: number) {
    return `This action removes a #${id} size`;
  }
}
