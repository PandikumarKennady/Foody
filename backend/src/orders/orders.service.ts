import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';
import { EmailService } from '../email/email.service';
import { ContentstackService } from '../contentstack/contentstack.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    private emailService: EmailService,
    private contentstackService: ContentstackService,
  ) {}

  // Generate unique order ID
  private generateOrderId(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `FDY-${dateStr}-${random}`;
  }

  async create(createOrderDto: CreateOrderDto, userId?: string): Promise<OrderDocument> {
    // Calculate offer/discount if offer code provided
    let discountAmount = 0;
    let offerDescription = null;

    if (createOrderDto.offerCode) {
      const offerResult = await this.contentstackService.getOfferByCode(createOrderDto.offerCode);
      if (offerResult) {
        discountAmount = this.calculateDiscount(
          createOrderDto.originalPrice * createOrderDto.quantity,
          offerResult.discountType,
          offerResult.discountValue,
        );
        offerDescription = offerResult.description;
      }
    }

    // Calculate final price
    const subtotal = createOrderDto.originalPrice * createOrderDto.quantity;
    const finalPrice = createOrderDto.originalPrice - (discountAmount / createOrderDto.quantity);
    const totalAmount = subtotal - discountAmount;

    const order = new this.orderModel({
      ...createOrderDto,
      orderId: this.generateOrderId(),
      userId: userId || undefined,
      discountAmount,
      offerDescription,
      finalPrice,
      totalAmount,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await order.save();

    // Send confirmation email to customer
    await this.emailService.sendOrderConfirmation(savedOrder);

    return savedOrder;
  }

  private calculateDiscount(
    amount: number,
    discountType: 'percentage' | 'fixed',
    discountValue: number,
  ): number {
    if (discountType === 'percentage') {
      return Math.min((amount * discountValue) / 100, amount);
    }
    return Math.min(discountValue, amount);
  }

  async findAll(userId?: string): Promise<OrderDocument[]> {
    const query = userId ? { userId } : {};
    return this.orderModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id).exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findByOrderId(orderId: string): Promise<OrderDocument> {
    const order = await this.orderModel.findOne({ orderId }).exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // Get orders for a specific restaurant
  async findByRestaurant(restaurantUid: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ restaurantUid })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Get orders by status for a restaurant
  async findByRestaurantAndStatus(
    restaurantUid: string,
    status: OrderStatus,
  ): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ restaurantUid, status })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Get today's orders for a restaurant
  async findTodaysOrdersByRestaurant(restaurantUid: string): Promise<OrderDocument[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.orderModel
      .find({
        restaurantUid,
        createdAt: { $gte: today, $lt: tomorrow },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Update order status (for restaurant admin)
  async updateStatus(
    id: string,
    updateStatusDto: UpdateOrderStatusDto,
    restaurantUid?: string,
  ): Promise<OrderDocument> {
    const order = await this.findOne(id);

    // If restaurant UID provided, verify ownership
    if (restaurantUid && order.restaurantUid !== restaurantUid) {
      throw new ForbiddenException('You can only update your own restaurant orders');
    }

    // Update status
    order.status = updateStatusDto.status as OrderStatus;

    if (updateStatusDto.statusMessage) {
      order.statusMessage = updateStatusDto.statusMessage;
    }

    if (updateStatusDto.estimatedDeliveryTime) {
      order.estimatedDeliveryTime = updateStatusDto.estimatedDeliveryTime;
    }

    // Set timestamps based on status
    if (updateStatusDto.status === 'confirmed' && !order.confirmedAt) {
      order.confirmedAt = new Date();
    }

    if (updateStatusDto.status === 'delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();

    // Send status update email to customer
    await this.emailService.sendOrderStatusUpdate(updatedOrder);

    return updatedOrder;
  }

  // Get order statistics for restaurant dashboard
  async getRestaurantStats(restaurantUid: string): Promise<{
    totalOrders: number;
    todayOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    todayRevenue: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalOrders,
      todayOrders,
      pendingOrders,
      completedOrders,
      revenueAgg,
      todayRevenueAgg,
    ] = await Promise.all([
      this.orderModel.countDocuments({ restaurantUid }),
      this.orderModel.countDocuments({
        restaurantUid,
        createdAt: { $gte: today, $lt: tomorrow },
      }),
      this.orderModel.countDocuments({ restaurantUid, status: OrderStatus.PENDING }),
      this.orderModel.countDocuments({ restaurantUid, status: OrderStatus.DELIVERED }),
      this.orderModel.aggregate([
        { $match: { restaurantUid } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      this.orderModel.aggregate([
        {
          $match: {
            restaurantUid,
            createdAt: { $gte: today, $lt: tomorrow },
          },
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    return {
      totalOrders,
      todayOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      todayRevenue: todayRevenueAgg[0]?.total || 0,
    };
  }
}
