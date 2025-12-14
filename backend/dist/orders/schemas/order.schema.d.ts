import { Document, Types } from 'mongoose';
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PREPARING = "preparing",
    READY = "ready",
    OUT_FOR_DELIVERY = "out_for_delivery",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export type OrderDocument = Order & Document;
export declare class Order {
    _id: Types.ObjectId;
    orderId: string;
    userId: Types.ObjectId;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
    foodUid: string;
    foodTitle: string;
    restaurantUid: string;
    restaurantName: string;
    restaurantEmail: string;
    originalPrice: number;
    discountAmount: number;
    offerCode: string;
    offerDescription: string;
    finalPrice: number;
    quantity: number;
    totalAmount: number;
    notes: string;
    status: OrderStatus;
    statusMessage: string;
    estimatedDeliveryTime: string;
    confirmedAt: Date;
    deliveredAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order, any, {}> & Order & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Order> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
