import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizationController } from './authorization/authorization.controller';
import { AuthorizationService } from './authorization/authorization.service';
import { AuthorizationModule } from './authorization/authorization.module';
import { MeetupsController } from './meetups/meetups.controller';
import { MeetupsService } from './meetups/meetups.service';
import { SubscribeModule } from './subscribe/subscribe.module';
import { MeetupModule } from './meetups/meetups.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './authorization/jwt/accessToken.strategy';
import { RefreshTokenStrategy } from './authorization/jwt/refreshToken.strategy';

@Module({
  imports: [AuthorizationModule, MeetupModule, SubscribeModule],
  controllers: [AppController, AuthorizationController, MeetupsController],
  providers: [AppService, AuthorizationService, MeetupsService],
})
export class AppModule {}
