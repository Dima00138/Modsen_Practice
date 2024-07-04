import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizationController } from './authorization/authorization.controller';
import { AuthorizationService } from './authorization/authorization.service';
import { AuthorizationModule } from './authorization/authorization.module';
import { MeetupController } from './meetups/meetups.controller';
import { MeetupService as MeetupService } from './meetups/meetups.service';
import { SubscribeModule } from './subscribe/subscribe.module';
import { MeetupModule } from './meetups/meetups.module';
import { IsAuthenticatedMiddleware } from './common/middleware/authentication.middleware';
import { IsPrivilegedMiddleware } from './common/middleware/privileges.middleware';
import { SubscribeService } from './subscribe/subscribe.service';
import { SubscribeController } from './subscribe/subscribe.controller';

@Module({
  imports: [AuthorizationModule, MeetupModule, SubscribeModule],
  controllers: [AppController, AuthorizationController, MeetupController, SubscribeController],
  providers: [AppService, AuthorizationService, MeetupService, SubscribeService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsAuthenticatedMiddleware, IsPrivilegedMiddleware)
      .forRoutes('*');
  }
}
