export declare class CreateOrderDto {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
    foodUid: string;
    foodTitle: string;
    restaurantUid: string;
    restaurantName: string;
    restaurantEmail?: string;
    originalPrice: number;
    quantity: number;
    offerCode?: string;
    notes?: string;
}
export declare class UpdateOrderStatusDto {
    status: string;
    statusMessage?: string;
    estimatedDeliveryTime?: string;
}
