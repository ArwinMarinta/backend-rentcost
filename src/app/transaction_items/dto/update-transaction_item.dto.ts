import { PartialType } from '@nestjs/swagger';
import { CreateTransactionItemDto } from './create-transaction_item.dto';

export class UpdateTransactionItemDto extends PartialType(
  CreateTransactionItemDto,
) {}
