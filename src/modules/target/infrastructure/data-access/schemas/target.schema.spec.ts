import { TargetEntity } from './target.schema';

describe('TargetEntity', () => {
  it('should be defined and instantiable', () => {
    const entity = new TargetEntity();
    expect(entity).toBeDefined();
  });

  it('should accept all mapped properties', () => {
    const entity = new TargetEntity();
    const now = new Date();

    // Lưu ý: Class của bạn định nghĩa là _id, không phải id
    entity._id = 'uuid-123';
    entity.learnerId = 'learner-456';
    entity.score = 450;
    entity.targetDate = new Date('2026-12-31');
    entity.createdAt = now;
    entity.updatedAt = now;

    expect(entity._id).toBe('uuid-123');
    expect(entity.learnerId).toBe('learner-456');
    expect(entity.score).toBe(450);
    expect(entity.targetDate).toEqual(new Date('2026-12-31'));
    expect(entity.createdAt).toBe(now);
    expect(entity.updatedAt).toBe(now);
  });

  it('should allow score and targetDate to be null', () => {
    const entity = new TargetEntity();
    entity.score = null;
    entity.targetDate = null;

    expect(entity.score).toBeNull();
    expect(entity.targetDate).toBeNull();
  });
});
