import { CanActivate, ExecutionContext, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../decorators/roles.decorator";

export class RolesGuard implements CanActivate {
  private logger = new Logger(RolesGuard.name);
  constructor(
    private reflector: Reflector,
    ) {}

  matchRoles(roles: string[], role: string): boolean {
    return roles.includes(role);
  }

  canActivate(context: ExecutionContext): boolean {
    this.logger.debug(`Checking roles for ${context.getClass().name}:${context.getHandler()}`);
    const roles = this.reflector.get(Roles, context.getHandler());
    
    if (!roles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    this.logger.debug(`User has role: ${user['role'] ? 'true' : 'false'}`);
    return this.matchRoles(roles, user['role']);
  }
}