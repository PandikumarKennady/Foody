import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: CreateUserDto): Promise<UserDocument>;
    findAll(): Promise<UserDocument[]>;
    findOne(id: string): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findRestaurantAdmins(): Promise<UserDocument[]>;
    findByRestaurantUid(restaurantUid: string): Promise<UserDocument | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument>;
    updatePassword(id: string, newPassword: string): Promise<void>;
    validatePassword(user: UserDocument, password: string): Promise<boolean>;
}
