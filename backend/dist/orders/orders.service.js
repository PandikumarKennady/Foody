"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const email_service_1 = require("../email/email.service");
const contentstack_service_1 = require("../contentstack/contentstack.service");
let OrdersService = class OrdersService {
    constructor(orderModel, emailService, contentstackService) {
        this.orderModel = orderModel;
        this.emailService = emailService;
        this.contentstackService = contentstackService;
    }
    generateOrderId() {
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `FDY-${dateStr}-${random}`;
    }
    async create(createOrderDto, userId) {
        let discountAmount = 0;
        let offerDescription = null;
        if (createOrderDto.offerCode) {
            const offerResult = await this.contentstackService.getOfferByCode(createOrderDto.offerCode);
            if (offerResult) {
                discountAmount = this.calculateDiscount(createOrderDto.originalPrice * createOrderDto.quantity, offerResult.discountType, offerResult.discountValue);
                offerDescription = offerResult.description;
            }
        }
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
            status: order_schema_1.OrderStatus.PENDING,
        });
        const savedOrder = await order.save();
        await this.emailService.sendOrderConfirmation(savedOrder);
        return savedOrder;
    }
    calculateDiscount(amount, discountType, discountValue) {
        if (discountType === 'percentage') {
            return Math.min((amount * discountValue) / 100, amount);
        }
        return Math.min(discountValue, amount);
    }
    async findAll(userId) {
        const query = userId ? { userId } : {};
        return this.orderModel
            .find(query)
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const order = await this.orderModel.findById(id).exec();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async findByOrderId(orderId) {
        const order = await this.orderModel.findOne({ orderId }).exec();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async findByRestaurant(restaurantUid) {
        return this.orderModel
            .find({ restaurantUid })
            .sort({ createdAt: -1 })
            .exec();
    }
    async findByRestaurantAndStatus(restaurantUid, status) {
        return this.orderModel
            .find({ restaurantUid, status })
            .sort({ createdAt: -1 })
            .exec();
    }
    async findTodaysOrdersByRestaurant(restaurantUid) {
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
    async updateStatus(id, updateStatusDto, restaurantUid) {
        const order = await this.findOne(id);
        if (restaurantUid && order.restaurantUid !== restaurantUid) {
            throw new common_1.ForbiddenException('You can only update your own restaurant orders');
        }
        order.status = updateStatusDto.status;
        if (updateStatusDto.statusMessage) {
            order.statusMessage = updateStatusDto.statusMessage;
        }
        if (updateStatusDto.estimatedDeliveryTime) {
            order.estimatedDeliveryTime = updateStatusDto.estimatedDeliveryTime;
        }
        if (updateStatusDto.status === 'confirmed' && !order.confirmedAt) {
            order.confirmedAt = new Date();
        }
        if (updateStatusDto.status === 'delivered' && !order.deliveredAt) {
            order.deliveredAt = new Date();
        }
        const updatedOrder = await order.save();
        await this.emailService.sendOrderStatusUpdate(updatedOrder);
        return updatedOrder;
    }
    async getRestaurantStats(restaurantUid) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [totalOrders, todayOrders, pendingOrders, completedOrders, revenueAgg, todayRevenueAgg,] = await Promise.all([
            this.orderModel.countDocuments({ restaurantUid }),
            this.orderModel.countDocuments({
                restaurantUid,
                createdAt: { $gte: today, $lt: tomorrow },
            }),
            this.orderModel.countDocuments({ restaurantUid, status: order_schema_1.OrderStatus.PENDING }),
            this.orderModel.countDocuments({ restaurantUid, status: order_schema_1.OrderStatus.DELIVERED }),
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        email_service_1.EmailService,
        contentstack_service_1.ContentstackService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map