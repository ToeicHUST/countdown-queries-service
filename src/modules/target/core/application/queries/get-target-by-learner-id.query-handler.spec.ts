import { Test, TestingModule } from '@nestjs/testing';
import { TargetRepositoryPort } from '../ports/data-access/target.repository.port';
import { GetTargetByLearnerIdQuery } from './get-target-by-learner-id.query';
import { GetTargetByLearnerIdQueryHandler } from './get-target-by-learner-id.query-handler';

describe('GetTargetByLearnerIdQueryHandler', () => {
  let handler: GetTargetByLearnerIdQueryHandler;
  let repository: TargetRepositoryPort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTargetByLearnerIdQueryHandler,
        {
          provide: TargetRepositoryPort,
          useValue: {
            getOneByLearnerId: jest.fn(), // Mocking the method
          },
        },
      ],
    }).compile();

    handler = module.get<GetTargetByLearnerIdQueryHandler>(
      GetTargetByLearnerIdQueryHandler,
    );
    repository = module.get<TargetRepositoryPort>(TargetRepositoryPort);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should return a target when repository finds one', async () => {
    const mockTarget = { id: '1', learnerId: 'learner-123' };
    jest
      .spyOn(repository, 'getOneByLearnerId')
      .mockResolvedValue(mockTarget as any);

    const result = await handler.execute(
      new GetTargetByLearnerIdQuery('learner-123'),
    );

    expect(result).toEqual(mockTarget);
    expect(repository.getOneByLearnerId).toHaveBeenCalledWith('learner-123');
  });
});
