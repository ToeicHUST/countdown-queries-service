import {
  CanActivate,
  ExecutionContext,
  INestApplication,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs'; // Import QueryBus
import { JwtAuthGuard, Score } from '@toeichust/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { main } from './common/utils/main.util';

describe('TargetController (e2e)', () => {
  let app: INestApplication;
  const MOCK_learner_ID = 'learner-test-123';

  const mockQueryBus = {
    execute: jest.fn(),
    register: jest.fn(),
    subscribe: jest.fn(),
  };

  beforeAll(async () => {
    app = await main(AppModule, (builder) => {
      builder.overrideGuard(JwtAuthGuard).useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.learner = {
            learnerId: MOCK_learner_ID,
            email: 'test@example.com',
          };
          return true;
        },
      } as CanActivate);

      builder.overrideProvider(QueryBus).useValue(mockQueryBus);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/target', () => {
    it('should return target successfully', async () => {
      const mockTargetData = {
        id: 'target-1',
        learnerId: MOCK_learner_ID,
        score: new Score(600),
        targetDate: '2026-12-31T09:00:00.000Z',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockQueryBus.execute.mockResolvedValue(mockTargetData);

      const response = await request(app.getHttpServer())
        .get('/api/target')
        .expect(200);

      expect(mockQueryBus.execute).toHaveBeenCalled();

      expect(response).toBeDefined();
      expect(response.body).toBeDefined();
      expect(response.body.message).toBeDefined();
      expect(response.body.data).toBeDefined();

      expect(response.body.message).toBe('Get Target successfully');

      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.score).toBe(600);
      expect(response.body.data.targetDate).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();
    });

    it('should return empty/null if no target found (depending on logic)', async () => {
      mockQueryBus.execute.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get('/api/target')
        .expect(200);

      expect(response.body.message).toBe('No target found for the learner');
      expect(response.body.data).toBeUndefined();
    });
  });
});
