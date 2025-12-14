import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { OrderStatus } from './schemas/order.schema';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Create order (can be guest or authenticated)
  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Create a new order' })
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const userId = req.user?.id; // Optional - guest orders allowed
    console.log('[OrdersController] Creating order for user:', userId);
    return this.ordersService.create(createOrderDto, userId);
  }

  // Get user's orders
  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user orders' })
  async getMyOrders(@Request() req) {
    return this.ordersService.findAll(req.user.id);
  }

  // Track order by order ID (public)
  @Get('track/:orderId')
  @ApiOperation({ summary: 'Track order by order ID' })
  async trackOrder(@Param('orderId') orderId: string) {
    const order = await this.ordersService.findByOrderId(orderId);
    return {
      orderId: order.orderId,
      status: order.status,
      statusMessage: order.statusMessage,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
      foodTitle: order.foodTitle,
      restaurantName: order.restaurantName,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      confirmedAt: order.confirmedAt,
      deliveredAt: order.deliveredAt,
    };
  }

  // ============================================
  // RESTAURANT ADMIN ENDPOINTS
  // ============================================

  @Get('restaurant/dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get restaurant dashboard stats' })
  async getRestaurantDashboard(@Request() req) {
    return this.ordersService.getRestaurantStats(req.user.restaurantUid);
  }

  @Get('restaurant/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders for restaurant' })
  async getRestaurantOrders(@Request() req) {
    return this.ordersService.findByRestaurant(req.user.restaurantUid);
  }

  @Get('restaurant/today')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get today's orders for restaurant" })
  async getTodaysOrders(@Request() req) {
    return this.ordersService.findTodaysOrdersByRestaurant(req.user.restaurantUid);
  }

  @Get('restaurant/by-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get orders by status for restaurant' })
  @ApiQuery({ name: 'status', enum: OrderStatus })
  async getOrdersByStatus(@Request() req, @Query('status') status: OrderStatus) {
    return this.ordersService.findByRestaurantAndStatus(req.user.restaurantUid, status);
  }

  @Patch('restaurant/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status (Restaurant admin)' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
    @Request() req,
  ) {
    return this.ordersService.updateStatus(id, updateStatusDto, req.user.restaurantUid);
  }

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders (Super admin)' })
  async getAllOrders() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by ID' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
