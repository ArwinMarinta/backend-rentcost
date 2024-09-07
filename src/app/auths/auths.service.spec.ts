import { Test, TestingModule } from '@nestjs/testing';
import { AuthsService } from './auths.service';

describe('AuthsService', () => {
  let service: AuthsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthsService],
    }).compile();

    service = module.get<AuthsService>(AuthsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findOne', () => {
    it('should return user with the given email ', async () => {
      const userEmail = 'Novella_Roberts90@hotmail.com';
      const user = await service.findOne(userEmail);
      expect(user?.email).toEqual(userEmail);
    });
  });
});
