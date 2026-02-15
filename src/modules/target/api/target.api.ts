import { EventListenerController } from './http/controllers/event-listener.controller';
import { TargetController } from './http/controllers/target.controller';

export const TargetApi = {
  resolvers: [],
  controllers: [TargetController, EventListenerController],
};
