import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { User } from '../users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(private dataSource: DataSource) {}

  async create(createAddressDto: CreateAddressDto, req: any): Promise<void> {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { auth: { id: req.user.auth_id } } });

    if (!user) {
      throw new NotFoundException('User not found or not authenticated');
    }

    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Address)
      .values({ ...createAddressDto, user: user })
      .execute();
  }

  async findById(req: any) {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { auth: { id: req.user.auth_id } } });

    if (!user) {
      throw new NotFoundException('User not found or not authenticated');
    }

    const addressUser = await this.dataSource
      .getRepository(Address)
      .find({ where: { user: { id: user.id } } });

    return addressUser;
  }

  findAll() {
    return `This action returns all address`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  async remove(id: number) {
    const address = await this.dataSource
      .getRepository(Address)
      .findOne({ where: { id: id } });

    if (!address) {
      throw new NotFoundException('Address not founds');
    }

    await this.dataSource.getRepository(Address).delete(address.id);
  }
}
