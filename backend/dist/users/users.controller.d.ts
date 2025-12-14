import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<any>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<any>;
    findAll(): Promise<import("./schemas/user.schema").UserDocument[]>;
    findRestaurantAdmins(): Promise<import("./schemas/user.schema").UserDocument[]>;
    findOne(id: string): Promise<any>;
}
