import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({ example: '+91 9876543210' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({ example: '123 Main Street, Chennai, Tamil Nadu' })
  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @ApiProperty({ description: 'Food item UID from Contentstack' })
  @IsString()
  @IsNotEmpty()
  foodUid: string;

  @ApiProperty({ example: 'Butter Chicken' })
  @IsString()
  @IsNotEmpty()
  foodTitle: string;

  @ApiProperty({ description: 'Restaurant UID from Contentstack' })
  @IsString()
  @IsNotEmpty()
  restaurantUid: string;

  @ApiProperty({ example: 'Punjab Kitchen' })
  @IsString()
  @IsNotEmpty()
  restaurantName: string;

  @ApiPropertyOptional({ example: 'restaurant@example.com' })
  @IsEmail()
  @IsOptional()
  restaurantEmail?: string;

  @ApiProperty({ example: 240 })
  @IsNumber()
  @Min(0)
  originalPrice: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ example: 'SAVE10' })
  @IsString()
  @IsOptional()
  offerCode?: string;

  @ApiPropertyOptional({ example: 'Extra spicy please' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ 
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    example: 'confirmed'
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({ example: 'Your order is being prepared' })
  @IsString()
  @IsOptional()
  statusMessage?: string;

  @ApiPropertyOptional({ example: '30-45 minutes' })
  @IsString()
  @IsOptional()
  estimatedDeliveryTime?: string;
}

