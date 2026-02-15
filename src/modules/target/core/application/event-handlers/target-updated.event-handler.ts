import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Score, TargetUpdatedEvent } from '@toeichust/common';
import { TargetFactory } from '../../domain/factories/target.factory';
import { TargetRepositoryPort } from '../ports/data-access/target.repository.port';

@EventsHandler(TargetUpdatedEvent)
export class TargetUpdatedEventHandler implements IEventHandler<TargetUpdatedEvent> {
  private readonly logger = new Logger(TargetUpdatedEventHandler.name);

  constructor(private readonly targetRepository: TargetRepositoryPort) {}

  async handle(event: TargetUpdatedEvent): Promise<void> {
    try {
      this.logger.debug(`event: ${JSON.stringify(event)}`);

      let target = await this.targetRepository.getOneByLearnerId(
        event.data.learnerId,
      );

      if (target) {
        this.logger.log(
          `Target found for learnerId: ${event.data.learnerId}. Updating...`,
        );

        target.updateTarget(
          new Score(event.data.score!),
          event.data.targetDate!,
        );
      } else {
        this.logger.log(
          `Target not found for learnerId: ${event.data.learnerId}. Creating new...`,
        );
        target = TargetFactory.createNewTarget(
          event.data.learnerId,
          new Score(event.data.score!),
          event.data.targetDate!,
        );
      }

      const savedTarget = await this.targetRepository.save(target);

      this.logger.log(`Target saved successfully: ${savedTarget.id}`);
    } catch (error) {
      this.logger.error(`error: ${error.message}`, error.stack);
    }
  }
}
