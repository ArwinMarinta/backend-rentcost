import { Test, TestingModule } from '@nestjs/testing';
import { CartsItemService } from './carts_item.service';

describe('CartsItemService', () => {
  let service: CartsItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartsItemService],
    }).compile();

    service = module.get<CartsItemService>(CartsItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
