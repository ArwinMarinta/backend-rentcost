import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      throw new ConflictException('Size already exists');
    }

    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Size)
      .values({ ...createSizeDto })
      .execute();
  }

  async findAll() {
    return await this.dataSource.getRepository(Size).find({
      select: {
        id: true,
        size_name: true,
        created_at: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} size`;
  }

  async update(id: number, updateSizeDto: UpdateSizeDto): Promise<void> {
    const size = await this.dataSource.getRepository(Size).find({
      where: { size_name: updateSizeDto.size_name },
    });

    if (!size) {
      throw new NotFoundException('Size not found');
    }

    await this.dataSource
      .createQueryBuilder()
      .update(Size)
      .set(updateSizeDto)
      .where('id= :id', { id })
      .execute();
  }

  remove(id: number) {
    return `This action removes a #${id} size`;
  }
}
