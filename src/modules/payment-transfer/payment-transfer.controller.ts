import { Controller } from '@nestjs/common';
import { PaymentTransferService } from './payment-transfer.service';

@Controller('payment-transfer')
export class PaymentTransferController {
  constructor(private readonly paymentTransferService: PaymentTransferService) {}
}
