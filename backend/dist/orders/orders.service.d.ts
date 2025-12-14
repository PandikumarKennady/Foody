import { Model } from 'mongoose';
import { OrderDocument, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';
import { EmailService } from '../email/email.service';
import { ContentstackService } from '../contentstack/contentstack.service';
export declare class OrdersService {
    private orderModel;
    private emailService;
    private contentstackService;
    constructor(orderModel: Model<OrderDocument>, emailService: EmailService, contentstackService: ContentstackService);
    private generateOrderId;
    create(createOrderDto: CreateOrderDto, userId?: string): Promise<OrderDocument>;
    private calculateDiscount;
    findAll(userId?: string): Promise<OrderDocument[]>;
    findOne(id: string): Promise<OrderDocument>;
    findByOrderId(orderId: string): Promise<OrderDocument>;
    findByRestaurant(restaurantUid: string): Promise<OrderDocument[]>;
    findByRestaurantAndStatus(restaurantUid: string, status: OrderStatus): Promise<OrderDocument[]>;
    findTodaysOrdersByRestaurant(restaurantUid: string): Promise<OrderDocument[]>;
    updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto, restaurantUid?: string): Promise<OrderDocument>;
    getRestaurantStats(restaurantUid: string): Promise<{
        totalOrders: number;
        todayOrders: number;
        pendingOrders: number;
        completedOrders: number;
        totalRevenue: number;
        todayRevenue: number;
    }>;
}
