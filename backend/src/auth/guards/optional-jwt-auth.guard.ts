import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    // Don't throw error if no user - just return null
    // This allows both authenticated and guest users
    return user || null;
  }

  canActivate(context: ExecutionContext) {
    // Try to authenticate, but don't fail if no token
    return super.canActivate(context);
  }
}

