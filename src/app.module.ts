import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { MessageModule } from './message/message.module';
import typeorm from './config/typeorm';
import { ChatModule } from './chat/chat.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './middleware/http-exception-filter';
import { AppLoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm'))
    }),
    ChatModule,
    UserModule,
    RoomModule,
    AuthModule,
    MessageModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/user', method: RequestMethod.POST},
        { path: '/user/signIn', method: RequestMethod.POST},
      )
      .forRoutes('');
      consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
