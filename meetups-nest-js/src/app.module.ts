import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthorizationModule } from './authorization/authorization.module';
import { SubscribeModule } from './subscribe/subscribe.module';
import { MeetupModule } from './meetups/meetups.module';
import { IsAuthenticatedMiddleware } from './common/middleware/authentication.middleware';
import { IsPrivilegedMiddleware } from './common/middleware/privileges.middleware';
import { PrismaModule } from './database/database.module';
import { UserService } from './authorization/users.service';
import { MeetupService } from './meetups/meetups.service';

@Module({
  imports: [AuthorizationModule, MeetupModule, SubscribeModule, PrismaModule],
  providers: [UserService, MeetupService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .forRoutes('*');
  }
}
