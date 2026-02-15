import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventTopics } from '@toeichust/common';
import { EventListenerController } from './event-listener.controller';

describe('EventListenerController', () => {
  let controller: EventListenerController;
  let eventBus: EventBus;

  const mockEventBus = {
    publish: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventListenerController],
      providers: [
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
      ],
    }).compile();

    controller = module.get<EventListenerController>(EventListenerController);
    eventBus = module.get<EventBus>(EventBus);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return error message if payload or event is missing', async () => {
      const result = await controller.create(null as any);
      expect(result).toEqual({ message: 'No event payload received.' });
    });

    it('should warn and return undefined if data is missing in payload', async () => {
      const payload = {
        event: { topic: EventTopics.TARGET_UPDATED, data: null },
      };
      const result = await controller.create(payload as any);

      expect(result).toBeUndefined();
      expect(mockEventBus.publish).not.toHaveBeenCalled();
    });
    it('should publish TargetUpdatedEvent when topic is TARGET_UPDATED', async () => {
      const mockData = {
        targetId: 'target-1',
        learnerId: 'learner-1',
        score: 900,
        targetDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const payload = {
        event: {
          topic: EventTopics.TARGET_UPDATED,
          data: mockData,
        },
      };

      const result = await controller.create(payload as any);

      // 1. Verify EventBus.publish was called
      expect(mockEventBus.publish).toHaveBeenCalledTimes(1);

      // 2. Get the published event instance
      const publishedEvent = mockEventBus.publish.mock.calls[0][0];

      // 3. Match against the actual nested structure shown in the logs
      expect(publishedEvent).toMatchObject({
        topic: EventTopics.TARGET_UPDATED,
        data: {
          targetId: mockData.targetId,
          learnerId: mockData.learnerId,
          score: mockData.score,
        },
      });

      expect(result).toEqual({
        message: 'Event received successfully.',
        data: payload,
      });
    });

    it('should warn if the topic is not supported', async () => {
      const payload = {
        event: {
          topic: 'UNKNOWN_TOPIC',
          data: { key: 'value' },
        },
      };

      const result = await controller.create(payload as any);

      expect(mockEventBus.publish).not.toHaveBeenCalled();
      expect(result?.message).toBe('Event received successfully.');
    });
  });
});
