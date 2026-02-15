import { QueryBus } from '@nestjs/cqrs'; // Đổi từ CommandBus sang QueryBus
import { Test, TestingModule } from '@nestjs/testing';
import { BaseResponseDto, Score } from '@toeichust/common';
import { GetTargetByLearnerIdQuery } from '../../../core/application/queries/get-target-by-learner-id.query';
import { TargetController } from './target.controller';

describe('TargetController', () => {
  let controller: TargetController;
  let queryBus: QueryBus;

  const mockExecute = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TargetController],
      providers: [
        {
          provide: QueryBus,
          useValue: { execute: mockExecute },
        },
      ],
    }).compile();

    controller = module.get<TargetController>(TargetController);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTarget', () => {
    const learnerId = 'learner-123';

    const mockTargetData = {
      // data: {
      id: 'target-id-1',
      learnerId: learnerId,
      score: new Score(850),
      targetDate: new Date('2026-12-31'),
      createdAt: new Date(),
      updatedAt: new Date(),
      // },
    };

    it('should execute GetTargetByLearnerIdQuery and return formatted response', async () => {
      mockExecute.mockResolvedValue(mockTargetData);

      const result = await controller.getTarget(learnerId);

      expect(mockExecute).toHaveBeenCalledWith(
        new GetTargetByLearnerIdQuery(learnerId),
      );

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(BaseResponseDto);
      expect(result.message).toBeDefined();
      expect(result.data).toBeDefined();

      expect(result.message).toBe('Get Target successfully');

      expect(result.data.id).toBe('target-id-1');
      expect(result.data.learnerId).toBe(learnerId);
      expect(result.data.score).toBe(850);
      expect(result.data.targetDate).toEqual(mockTargetData.targetDate);
      expect(result.data.createdAt).toBeDefined();
      expect(result.data.updatedAt).toBeDefined();
    });
  });
});
