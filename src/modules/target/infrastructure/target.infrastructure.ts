import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EventPublisherPort,
  UpstashQstashEventPublisherAdapter,
  WebhookEventPublisherAdapter,
} from '@toeichust/common';
import { TargetRepositoryPort } from '../core/application/ports/data-access/target.repository.port';
import { TargetOrmRepository } from './data-access/repositories/target.orm-repository';
import {
  TargetEntity,
  TargetSchema,
} from './data-access/schemas/target.schema';

// const isUseWebhook  = true;
const isUseWebhook = false;

export const TargetInfrastructure = {
  imports: [
    ...(isUseWebhook ? [HttpModule] : []),
    MongooseModule.forFeature([
      { name: TargetEntity.name, schema: TargetSchema },
    ]),
  ],
  providers: [
    {
      provide: EventPublisherPort,
      useClass: isUseWebhook
        ? WebhookEventPublisherAdapter
        : UpstashQstashEventPublisherAdapter,
    },
    {
      provide: TargetRepositoryPort,
      useClass: TargetOrmRepository,
    },
  ],
};
