import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      return false;
    }

    // Super Admins bypass permission checks
    const isSuperAdmin = user.roles?.some((r: any) => r.role.name === 'SUPER_ADMIN');
    if (isSuperAdmin) {
      return true;
    }

    // Extract flat permissions from the user object (hydrated by AuthStrategy/Service)
    const userPermissions = this.flattenPermissions(user);
    
    const hasPermission = requiredPermissions.some((permission) => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }

    return true;
  }

  private flattenPermissions(user: any): string[] {
    const permissions = new Set<string>();
    
    user.roles?.forEach((userRole: any) => {
      userRole.role?.permissions?.forEach((rp: any) => {
        if (rp.permission?.code) {
          permissions.add(rp.permission.code);
        }
      });
    });
    
    return Array.from(permissions);
  }
}
