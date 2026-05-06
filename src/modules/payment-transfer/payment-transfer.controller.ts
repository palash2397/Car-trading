import { Controller } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags
} from '@nestjs/swagger';
import { PaymentTransferService } from './payment-transfer.service';

@ApiTags('Payment Transfer')
@ApiBearerAuth('access-token')
@Controller('payment-transfer')
export class PaymentTransferController {
  constructor(
    private readonly paymentTransferService: PaymentTransferService,
  ) {}
}
