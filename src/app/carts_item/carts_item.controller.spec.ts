import { Test, TestingModule } from '@nestjs/testing';
import { CartsItemController } from './carts_item.controller';
import { CartsItemService } from './carts_item.service';

describe('CartsItemController', () => {
  let controller: CartsItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsItemController],
      providers: [CartsItemService],
    }).compile();

    controller = module.get<CartsItemController>(CartsItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
