import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Seller, SellerSchema } from './schema/seller.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Mechanic, MechanicSchema } from '../mechanic/schemas/mechanic.schema';
import { Tower, TowerSchema } from '../tower/schema/tower.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Seller.name, schema: SellerSchema },
      { name: User.name, schema: UserSchema },
      { name: Mechanic.name, schema: MechanicSchema },
      { name: Tower.name, schema: TowerSchema },
    ]),
  ],
  controllers: [SellerController],
  providers: [SellerService],
  exports: [
    SellerService,
    MongooseModule.forFeature([
      { name: Seller.name, schema: SellerSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class SellerModule {}
