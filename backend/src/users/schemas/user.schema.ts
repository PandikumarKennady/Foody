import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum UserRole {
  CONSUMER = 'consumer',
  RESTAURANT_ADMIN = 'restaurant_admin',
  SUPER_ADMIN = 'super_admin',
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  phone: string;

  @Prop({ trim: true })
  address: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.CONSUMER })
  role: UserRole;

  // For restaurant admins - linked to Contentstack restaurant UID
  @Prop()
  restaurantUid: string;

  @Prop()
  restaurantName: string;

  @Prop({ default: true })
  isActive: boolean;

  // Timestamps added automatically by { timestamps: true }
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ restaurantUid: 1 });

