import { Document, Types } from 'mongoose';
export declare enum UserRole {
    CONSUMER = "consumer",
    RESTAURANT_ADMIN = "restaurant_admin",
    SUPER_ADMIN = "super_admin"
}
export type UserDocument = User & Document;
export declare class User {
    _id: Types.ObjectId;
    email: string;
    password: string;
    name: string;
    phone: string;
    address: string;
    role: UserRole;
    restaurantUid: string;
    restaurantName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
