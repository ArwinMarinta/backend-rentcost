import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(private dataSource: DataSource) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values(createCategoryDto)
      .execute();
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.dataSource.getRepository(Category).find({
      select: {
        id: true,
        category_name: true,
      },
    });

    return categories;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.dataSource
      .createQueryBuilder()
      .update(Category)
      .set(updateCategoryDto)
      .where('id = :id', { id: id })
      .execute();
  }

  async remove(id: number): Promise<void> {
    const category = await this.dataSource.getRepository(Category).findOne({
      where: {
        id: id,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.dataSource.getRepository(Category).delete(category.id);
  }
}
