import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDocument, UserRole } from '../users/schemas/user.schema';
import { ContentstackService } from '../contentstack/contentstack.service';
export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
    restaurantUid?: string;
}
export declare class AuthService {
    private usersService;
    private jwtService;
    private contentstackService;
    constructor(usersService: UsersService, jwtService: JwtService, contentstackService: ContentstackService);
    validateUser(email: string, password: string): Promise<UserDocument | null>;
    login(user: UserDocument): Promise<{
        accessToken: string;
        user: any;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        accessToken: string;
        user: any;
    }>;
    registerRestaurantAdmin(createUserDto: CreateUserDto): Promise<{
        accessToken: string;
        user: any;
    }>;
    validateToken(token: string): Promise<JwtPayload | null>;
}
