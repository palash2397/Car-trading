import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DealerService } from './dealer.service';
import { DealerController } from './dealer.controller';
import { Dealer, DealerSchema } from './schemas/dealer.schema';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Dealer.name, schema: DealerSchema }]),
  ],
  controllers: [DealerController],
  providers: [DealerService],
  exports: [
    DealerService,
    MongooseModule.forFeature([{ name: Dealer.name, schema: DealerSchema }]),
  ],
})
export class DealerModule {}
