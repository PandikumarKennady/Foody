import { ConfigService } from '@nestjs/config';
import { OrderDocument } from '../orders/schemas/order.schema';
export declare class EmailService {
    private configService;
    private readonly logger;
    private readonly webhookUrl;
    constructor(configService: ConfigService);
    sendOrderConfirmation(order: OrderDocument): Promise<void>;
    sendOrderStatusUpdate(order: OrderDocument): Promise<void>;
    private generateOrderConfirmationEmail;
    private generateStatusUpdateEmail;
}
