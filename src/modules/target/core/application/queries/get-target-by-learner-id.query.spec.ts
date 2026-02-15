import { GetTargetByLearnerIdQuery } from './get-target-by-learner-id.query';

describe('GetTargetByLearnerIdQuery', () => {
  it('should be defined', () => {
    const learnerId = 'learner-123';
    const query = new GetTargetByLearnerIdQuery(learnerId);
    expect(query).toBeDefined();
    expect(query.learnerId).toBe(learnerId);
  });
});
