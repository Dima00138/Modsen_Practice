import { Module } from '@nestjs/common';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { AccessTokenStrategy } from './jwt/accessToken.strategy';
import { RefreshTokenStrategy } from './jwt/refreshToken.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './users.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthorizationController],
  providers: [UserService, AuthorizationService, AccessTokenStrategy, RefreshTokenStrategy]
})
export class AuthorizationModule {}
