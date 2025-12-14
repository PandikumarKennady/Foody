import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        accessToken: string;
        user: any;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        accessToken: string;
        user: any;
    }>;
}
