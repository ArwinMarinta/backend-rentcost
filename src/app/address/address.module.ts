import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [JwtModule],
})
export class AddressModule {}
