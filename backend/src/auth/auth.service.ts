import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private contentstackService: ContentstackService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument | null> {
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

  async login(user: UserDocument): Promise<{ accessToken: string; user: any }> {
    const payload: JwtPayload = {
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

  async register(createUserDto: CreateUserDto): Promise<{ accessToken: string; user: any }> {
    // If registering as restaurant admin, create restaurant in Contentstack
    if (createUserDto.role === UserRole.RESTAURANT_ADMIN) {
      return this.registerRestaurantAdmin(createUserDto);
    }

    const user = await this.usersService.create(createUserDto);
    return this.login(user);
  }

  async registerRestaurantAdmin(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string; user: any }> {
    // Check if restaurantName is provided
    if (!createUserDto.restaurantName) {
      throw new BadRequestException('Restaurant name is required for restaurant admin registration');
    }

    let restaurantUid = createUserDto.restaurantUid;

    // If no restaurantUid provided, create new restaurant in Contentstack
    if (!restaurantUid) {
      const restaurant = await this.contentstackService.createRestaurant({
        title: createUserDto.restaurantName,
        email: createUserDto.email,
        phone: createUserDto.phone,
        address: createUserDto.address,
        description: `Welcome to ${createUserDto.restaurantName}!`,
      });

      if (!restaurant) {
        throw new BadRequestException('Failed to create restaurant in Contentstack. Please try again.');
      }

      restaurantUid = restaurant.uid;
    } else {
      // Verify the restaurant exists in Contentstack
      const existingRestaurant = await this.contentstackService.getRestaurantByUid(restaurantUid);
      if (!existingRestaurant) {
        throw new BadRequestException('Restaurant not found in Contentstack. Please check the UID.');
      }
    }

    // Create user with restaurant details
    const user = await this.usersService.create({
      ...createUserDto,
      role: UserRole.RESTAURANT_ADMIN,
      restaurantUid,
      restaurantName: createUserDto.restaurantName,
    });

    return this.login(user);
  }

  async validateToken(token: string): Promise<JwtPayload | null> {
    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }
}
