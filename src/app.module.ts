import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { getMainDbConfig, getLogDbConfig } from './config/typeorm.config';
import { DynamicLogModule } from './dynamic-log/dynamic-log.module';
import { EmailQueueModule } from './email-queue/email-queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({}),
    TypeOrmModule.forRootAsync({
      name: 'main', // main DB
      useFactory: getMainDbConfig,
    }),
    TypeOrmModule.forRootAsync({
      name: 'log', //  log DB
      useFactory: getLogDbConfig,
    }),
    AuthModule,
    UserModule,
    ProductModule,
    OrderModule,
    DynamicLogModule,
    EmailQueueModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}


