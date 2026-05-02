import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AppController } from './app.controller';
import { SellerModule } from './modules/seller/seller.module';
import { MechanicModule } from './modules/mechanic/mechanic.module';
import { DealerModule } from './modules/dealer/dealer.module';
import { TowerModule } from './modules/tower/tower.module';
import { BuyerModule } from './modules/buyer/buyer.module';
import { SellerListingModule } from './modules/seller-listing/seller-listing.module';
import { SellerRequestModule } from './modules/seller-request/seller-request.module';
import { ChatModule } from './modules/chat/chat.module';
import { ReserveRequestModule } from './modules/reserve-request/reserve-request.module';
import { BuyerRequestModule } from './modules/buy-request/buy-request.module';
import { BidOfferModule } from './modules/bid-offer/bid-offer.module';
import { MechanicInspectionModule } from './modules/mechanic-inspection/mechanic-inspection.module';
import { ShippingRequestModule } from './modules/shipping-request/shipping-request.module';
import { PaymentTransferModule } from './modules/payment-transfer/payment-transfer.module';


@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserModule,
    SellerModule,
    MechanicModule,
    DealerModule,
    TowerModule,
    BuyerModule,
    SellerListingModule,
    SellerRequestModule,
    ChatModule,
    ReserveRequestModule,
    BuyerRequestModule,
    BidOfferModule,
    MechanicInspectionModule,
    ShippingRequestModule,
    PaymentTransferModule,

  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
