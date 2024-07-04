import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizationController } from './authorization/authorization.controller';
import { AuthorizationService } from './authorization/authorization.service';
import { AuthorizationModule } from './authorization/authorization.module';
import { MeetupController } from './meetups/meetups.controller';
import { MeetupsService } from './meetups/meetups.service';
import { SubscribeModule } from './subscribe/subscribe.module';
import { MeetupModule } from './meetups/meetups.module';
import { IsAuthenticatedMiddleware } from './common/middleware/authentication.middleware';
import { IsPrivilegedMiddleware } from './common/middleware/privileges.middleware';

@Module({
  imports: [AuthorizationModule, MeetupModule, SubscribeModule],
  controllers: [AppController, AuthorizationController, MeetupController],
  providers: [AppService, AuthorizationService, MeetupsService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsAuthenticatedMiddleware, IsPrivilegedMiddleware)
      .forRoutes('*');
  }
}
