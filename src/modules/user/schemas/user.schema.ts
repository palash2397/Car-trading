import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

import { Role } from 'src/common/enums/user/role.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: [true, 'First name is required'],
    maxlength: [50, 'First name cannot be more than 50 characters'],
  })
  firstName: string;

  @Prop({
    required: [true, 'Last name is required'],
    maxlength: [50, 'Last name cannot be more than 50 characters'],
  })
  lastName: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  })
  email: string;

  @Prop({
    // required: function () {
    //   return this.provider === UserType.Local;
    // },
    required: true,
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false,
  })
  password: string;

  @Prop({
    required: false,
  })
  phoneNumber: string;

  @Prop({
    type: [String],
    enum: Object.values(Role),
    default: [Role.USER],
  })
  roles: Role[];

  @Prop({
    default: false,
  })
  isVerified: boolean;

  @Prop({
    default: true,
  })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', async function (this: UserDocument) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});
