import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  orderId: string; // Human-readable order ID like "FDY-20231214-001"

  // Customer info (can be guest or registered user)
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  customerName: string;

  @Prop({ required: true, lowercase: true, trim: true })
  customerEmail: string;

  @Prop({ required: true, trim: true })
  customerPhone: string;

  @Prop({ required: true })
  deliveryAddress: string;

  // Food item details from Contentstack
  @Prop({ required: true })
  foodUid: string;

  @Prop({ required: true })
  foodTitle: string;

  @Prop({ required: true })
  restaurantUid: string;

  @Prop({ required: true })
  restaurantName: string;

  @Prop()
  restaurantEmail: string;

  // Pricing
  @Prop({ required: true, type: Number })
  originalPrice: number;

  @Prop({ type: Number, default: 0 })
  discountAmount: number;

  @Prop()
  offerCode: string;

  @Prop()
  offerDescription: string;

  @Prop({ required: true, type: Number })
  finalPrice: number;

  @Prop({ required: true, type: Number, min: 1 })
  quantity: number;

  @Prop({ required: true, type: Number })
  totalAmount: number;

  // Order details
  @Prop()
  notes: string;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop()
  statusMessage: string;

  @Prop()
  estimatedDeliveryTime: string;

  // Status timestamps
  @Prop()
  confirmedAt: Date;

  @Prop()
  deliveredAt: Date;

  // Auto timestamps
  createdAt: Date;
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Create indexes for efficient queries
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ restaurantUid: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ restaurantUid: 1, status: 1 });
OrderSchema.index({ restaurantUid: 1, createdAt: -1 });

