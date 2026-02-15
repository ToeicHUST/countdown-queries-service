import { Test, TestingModule } from '@nestjs/testing';
import { Score, TargetUpdatedEvent } from '@toeichust/common';
import { TargetFactory } from '../../domain/factories/target.factory';
import { TargetRepositoryPort } from '../ports/data-access/target.repository.port';
import { TargetUpdatedEventHandler } from './target-updated.event-handler';

describe('TargetUpdatedEventHandler', () => {
  let handler: TargetUpdatedEventHandler;
  let mockTargetRepository: any;

  beforeEach(async () => {
    // 1. Tạo mock cho Repository thay vì Publisher
    mockTargetRepository = {
      getOneByLearnerId: jest.fn(),
      save: jest.fn().mockImplementation((target) => Promise.resolve(target)), // Giả lập save thành công
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TargetUpdatedEventHandler,
        // 2. Cung cấp mock Repository vào Module
        { provide: TargetRepositoryPort, useValue: mockTargetRepository },
      ],
    }).compile();

    handler = module.get<TargetUpdatedEventHandler>(TargetUpdatedEventHandler);
  });

  it('should find existing target, update it, and save', async () => {
    // Arrange
    const learnerId = 'learner-123';
    const existingTarget = TargetFactory.createNewTarget(
      learnerId,
      new Score(400),
      new Date('2025-01-01'),
    );
    // Giả lập tìm thấy target trong DB
    mockTargetRepository.getOneByLearnerId.mockResolvedValue(existingTarget);

    const event = new TargetUpdatedEvent(
      'any-id',
      learnerId,
      600, // Score mới
      new Date('2026-01-01'), // Date mới
      new Date(),
      new Date(),
    );

    // Act
    await handler.handle(event);

    // Assert
    // Kiểm tra đã gọi getOneByLearnerId chưa
    expect(mockTargetRepository.getOneByLearnerId).toHaveBeenCalledWith(
      learnerId,
    );

    // Kiểm tra xem đã gọi save chưa
    expect(mockTargetRepository.save).toHaveBeenCalled();

    // Kiểm tra logic update: score phải được cập nhật lên 600 trong object được save
    const savedTarget = mockTargetRepository.save.mock.calls[0][0];
    expect(savedTarget.score.value).toBe(600);
  });

  it('should create new target if not found, and save', async () => {
    // Arrange
    const learnerId = 'learner-new';
    // Giả lập không tìm thấy (trả về null)
    mockTargetRepository.getOneByLearnerId.mockResolvedValue(null);

    const event = new TargetUpdatedEvent(
      'any-id',
      learnerId,
      500,
      new Date('2026-08-10'),
      new Date(),
      new Date(),
    );

    // Act
    await handler.handle(event);

    // Assert
    expect(mockTargetRepository.getOneByLearnerId).toHaveBeenCalledWith(
      learnerId,
    );
    expect(mockTargetRepository.save).toHaveBeenCalled();

    // Kiểm tra logic create: object được save phải có learnerId đúng
    const savedTarget = mockTargetRepository.save.mock.calls[0][0];
    expect(savedTarget.learnerId).toBe(learnerId);
    expect(savedTarget.score.value).toBe(500);
  });
});
