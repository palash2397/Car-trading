import { Test, TestingModule } from '@nestjs/testing';
import { PaymentTransferController } from './payment-transfer.controller';
import { PaymentTransferService } from './payment-transfer.service';

describe('PaymentTransferController', () => {
  let controller: PaymentTransferController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentTransferController],
      providers: [PaymentTransferService],
    }).compile();

    controller = module.get<PaymentTransferController>(PaymentTransferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
