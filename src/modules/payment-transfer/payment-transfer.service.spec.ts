import { Test, TestingModule } from '@nestjs/testing';
import { PaymentTransferService } from './payment-transfer.service';

describe('PaymentTransferService', () => {
  let service: PaymentTransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentTransferService],
    }).compile();

    service = module.get<PaymentTransferService>(PaymentTransferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
