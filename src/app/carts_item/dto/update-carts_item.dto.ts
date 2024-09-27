import { PartialType } from '@nestjs/swagger';
import { CreateCartsItemDto } from './create-carts_item.dto';

export class UpdateCartsItemDto extends PartialType(CreateCartsItemDto) {}
