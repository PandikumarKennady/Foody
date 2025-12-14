"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const user_schema_1 = require("../users/schemas/user.schema");
const contentstack_service_1 = require("../contentstack/contentstack.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, contentstackService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.contentstackService = contentstackService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }
        const isPasswordValid = await this.usersService.validatePassword(user, password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
    async login(user) {
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
            restaurantUid: user.restaurantUid,
        };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                restaurantUid: user.restaurantUid,
                restaurantName: user.restaurantName,
            },
        };
    }
    async register(createUserDto) {
        if (createUserDto.role === user_schema_1.UserRole.RESTAURANT_ADMIN) {
            return this.registerRestaurantAdmin(createUserDto);
        }
        const user = await this.usersService.create(createUserDto);
        return this.login(user);
    }
    async registerRestaurantAdmin(createUserDto) {
        if (!createUserDto.restaurantName) {
            throw new common_1.BadRequestException('Restaurant name is required for restaurant admin registration');
        }
        let restaurantUid = createUserDto.restaurantUid;
        if (!restaurantUid) {
            const restaurant = await this.contentstackService.createRestaurant({
                title: createUserDto.restaurantName,
                email: createUserDto.email,
                phone: createUserDto.phone,
                address: createUserDto.address,
                description: `Welcome to ${createUserDto.restaurantName}!`,
            });
            if (!restaurant) {
                throw new common_1.BadRequestException('Failed to create restaurant in Contentstack. Please try again.');
            }
            restaurantUid = restaurant.uid;
        }
        else {
            const existingRestaurant = await this.contentstackService.getRestaurantByUid(restaurantUid);
            if (!existingRestaurant) {
                throw new common_1.BadRequestException('Restaurant not found in Contentstack. Please check the UID.');
            }
        }
        const user = await this.usersService.create({
            ...createUserDto,
            role: user_schema_1.UserRole.RESTAURANT_ADMIN,
            restaurantUid,
            restaurantName: createUserDto.restaurantName,
        });
        return this.login(user);
    }
    async validateToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch {
            return null;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        contentstack_service_1.ContentstackService])
], AuthService);
//# sourceMappingURL=auth.service.js.map