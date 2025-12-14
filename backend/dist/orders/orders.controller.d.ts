import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';
import { OrderStatus } from './schemas/order.schema';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto, req: any): Promise<import("./schemas/order.schema").OrderDocument>;
    getMyOrders(req: any): Promise<import("./schemas/order.schema").OrderDocument[]>;
    trackOrder(orderId: string): Promise<{
        orderId: string;
        status: OrderStatus;
        statusMessage: string;
        estimatedDeliveryTime: string;
        foodTitle: string;
        restaurantName: string;
        totalAmount: number;
        createdAt: Date;
        confirmedAt: Date;
        deliveredAt: Date;
    }>;
    getRestaurantDashboard(req: any): Promise<{
        totalOrders: number;
        todayOrders: number;
        pendingOrders: number;
        completedOrders: number;
        totalRevenue: number;
        todayRevenue: number;
    }>;
    getRestaurantOrders(req: any): Promise<import("./schemas/order.schema").OrderDocument[]>;
    getTodaysOrders(req: any): Promise<import("./schemas/order.schema").OrderDocument[]>;
    getOrdersByStatus(req: any, status: OrderStatus): Promise<import("./schemas/order.schema").OrderDocument[]>;
    updateOrderStatus(id: string, updateStatusDto: UpdateOrderStatusDto, req: any): Promise<import("./schemas/order.schema").OrderDocument>;
    getAllOrders(): Promise<import("./schemas/order.schema").OrderDocument[]>;
    findOne(id: string): Promise<import("./schemas/order.schema").OrderDocument>;
}
