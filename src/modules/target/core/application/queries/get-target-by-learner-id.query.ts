import { IQuery } from '@nestjs/cqrs';

export class GetTargetByLearnerIdQuery implements IQuery {
  constructor(public readonly learnerId: string) {}
}
