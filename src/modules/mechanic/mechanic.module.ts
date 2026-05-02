import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MechanicService } from './mechanic.service';
import { MechanicController } from './mechanic.controller';
import {
  Mechanic,
  MechanicSchema,
} from './schemas/mechanic.schema';

import { User, UserSchema } from 'src/modules/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mechanic.name, schema: MechanicSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [MechanicController],
  providers: [MechanicService],
  exports: [
    MechanicService,
    MongooseModule.forFeature([
      { name: Mechanic.name, schema: MechanicSchema },
    ]),
  ],
})
export class MechanicModule {}
