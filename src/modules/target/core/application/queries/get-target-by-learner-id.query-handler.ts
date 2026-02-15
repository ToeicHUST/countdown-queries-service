import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Target } from '../../domain/entities/target';
import { TargetRepositoryPort } from '../ports/data-access/target.repository.port';
import { GetTargetByLearnerIdQuery } from './get-target-by-learner-id.query';

@QueryHandler(GetTargetByLearnerIdQuery)
export class GetTargetByLearnerIdQueryHandler implements IQueryHandler<GetTargetByLearnerIdQuery> {
  private readonly logger = new Logger(GetTargetByLearnerIdQueryHandler.name);

  constructor(private readonly targetRepository: TargetRepositoryPort) {}

  async execute(query: GetTargetByLearnerIdQuery): Promise<Target | null> {
    try {
      this.logger.debug(`query: ${JSON.stringify(query)}`);

      const target = await this.targetRepository.getOneByLearnerId(
        query.learnerId,
      );

      this.logger.log(
        '🚀 ~ GetTargetByLearnerIdQueryHandler ~ execute ~ target:',
        target,
      );

      return target;
    } catch (error) {
      this.logger.error(`Error: ${error.message}`, error.stack);
      throw error;
    }
  }
}
