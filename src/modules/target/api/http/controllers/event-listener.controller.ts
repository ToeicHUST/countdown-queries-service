import { Body, Controller, Logger, Post } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import {
  EventListenerRequestDto,
  EventTopics,
  TargetUpdatedEvent,
} from '@toeichust/common';

@Controller('event-listener')
export class EventListenerController {
  private readonly logger = new Logger(EventListenerController.name);

  constructor(private readonly eventBus: EventBus) {}

  @Post()
  async create(@Body() payload: EventListenerRequestDto) {
    if (!payload || !payload.event) {
      this.logger.warn('No payload received in event listener');
      return { message: 'No event payload received.' };
    }

    const { topic, data } = payload?.event;

    this.logger.log(
      `Received event topic: ${topic} with data: ${JSON.stringify(data)}`,
    );

    if (!data) {
      this.logger.warn('No data found in event payload');
      return;
    }

    switch (topic) {
      case EventTopics.TARGET_UPDATED:
        this.eventBus.publish(
          new TargetUpdatedEvent(
            data.targetId,
            data.learnerId,
            data.score,
            data.targetDate,
            data.createdAt,
            data.updatedAt,
          ),
        );

        break;

      default:
        this.logger.warn(`No handler for topic: ${topic}`);
    }

    return {
      message: 'Event received successfully.',
      data: payload,
    };
  }
}
