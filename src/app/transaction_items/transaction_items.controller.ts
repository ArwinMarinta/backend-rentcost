import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionItemsService } from './transaction_items.service';
import { CreateTransactionItemDto } from './dto/create-transaction_item.dto';
import { UpdateTransactionItemDto } from './dto/update-transaction_item.dto';

@Controller('transaction-items')
export class TransactionItemsController {
  constructor(private readonly transactionItemsService: TransactionItemsService) {}

  @Post()
  create(@Body() createTransactionItemDto: CreateTransactionItemDto) {
    return this.transactionItemsService.create(createTransactionItemDto);
  }

  @Get()
  findAll() {
    return this.transactionItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionItemDto: UpdateTransactionItemDto) {
    return this.transactionItemsService.update(+id, updateTransactionItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionItemsService.remove(+id);
  }
}
