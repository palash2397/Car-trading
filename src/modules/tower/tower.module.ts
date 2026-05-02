import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TowerService } from './tower.service';
import { TowerController } from './tower.controller';

import { Tower, TowerSchema } from './schema/tower.schema';
import { User, UserSchema } from 'src/modules/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tower.name, schema: TowerSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TowerController],
  providers: [TowerService],
  exports: [
    TowerService,
    MongooseModule.forFeature([
      { name: Tower.name, schema: TowerSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class TowerModule {}
