import { Type } from '@nestjs/common';
import {
  CqrsModule,
  ICommandHandler,
  IEventHandler,
  IQueryHandler,
} from '@nestjs/cqrs';
import { TargetUpdatedEventHandler } from './event-handlers/target-updated.event-handler';
import { GetTargetByLearnerIdQueryHandler } from './queries/get-target-by-learner-id.query-handler';

const commandHandlers: Type<ICommandHandler>[] = [];

const eventHandlers: Type<IEventHandler>[] = [TargetUpdatedEventHandler];

const queryHandlers: Type<IQueryHandler>[] = [GetTargetByLearnerIdQueryHandler];

export const TargetApplication = {
  imports: [CqrsModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers],
};
