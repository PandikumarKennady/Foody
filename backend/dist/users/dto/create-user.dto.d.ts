import { UserRole } from '../schemas/user.schema';
export declare class CreateUserDto {
    email: string;
    password: string;
    name: string;
    phone?: string;
    address?: string;
    role?: UserRole;
    restaurantUid?: string;
    restaurantName?: string;
}
export declare class UpdateUserDto {
    name?: string;
    phone?: string;
    address?: string;
}
