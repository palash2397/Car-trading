import { Module } from '@nestjs/common';
import { PaymentTransferService } from './payment-transfer.service';
import { PaymentTransferController } from './payment-transfer.controller';

@Module({
  controllers: [PaymentTransferController],
  providers: [PaymentTransferService],
})
export class PaymentTransferModule {}
