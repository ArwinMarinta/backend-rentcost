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
  Request,
  UploadedFile,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '../auths/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { createHttpException } from 'src/common/middlewares/utils/http-exception.util';
import { ImageKitService } from 'src/utils/imagekit.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly fileService: ImageKitService,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('payment_image'))
  @Post()
  async create(
    @Request() req: any,
    @UploadedFile() payment_image: Express.Multer.File,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    try {
      const uploadResult = await this.fileService.uploadImage(payment_image);

      const productIds = createTransactionDto.productId
        .split(',')
        .map((id) => parseInt(id, 10));

      console.log(productIds);

      await this.transactionsService.create(
        req,
        uploadResult.url,
        createTransactionDto,
        productIds,
      );

      return {
        message: 'Berhasil dikirim',
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('tenant')
  async findTenant(@Request() req: any) {
    try {
      const history = await this.transactionsService.findTenant(req);

      return {
        message: 'Berhasil mengambil history',
        data: history,
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async findUser(@Request() req: any) {
    try {
      const history = await this.transactionsService.findUser(req);

      return {
        message: 'Berhasil mengambil history',
        data: history,
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
