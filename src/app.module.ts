import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule, ErrorHandlerFilter } from '@toeichust/common';
import dns from 'node:dns/promises';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TargetModule } from './modules/target/target.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // if (configService.get<string>('NODE_ENV') === 'development') {
        dns.setServers(['1.1.1.1']);
        // }

        return {
          uri: configService.get<string>(
            'MICROSERVICES_COUNTDOWN_QUERIES_SERVICE_MONGODB_URI',
          ),
        };
      },
    }),

    TargetModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ErrorHandlerFilter,
    },
  ],
})
export class AppModule {}
