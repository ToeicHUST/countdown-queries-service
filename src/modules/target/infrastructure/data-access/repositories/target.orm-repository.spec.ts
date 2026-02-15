import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Score } from '@toeichust/common';
import { TargetFactory } from '../../../core/domain/factories/target.factory';
import { TargetEntity } from '../schemas/target.schema';
import { TargetOrmRepository } from './target.orm-repository';

describe('TargetOrmRepository', () => {
  let repo: TargetOrmRepository;
  let mockTargetModel: any;

  beforeEach(async () => {
    // 1. Mock các hàm của Mongoose Model
    mockTargetModel = {
      // Hàm save của bạn dùng findByIdAndUpdate (không có .exec() trong code của bạn)
      findByIdAndUpdate: jest.fn(),

      // Hàm getOneByLearnerId của bạn có dùng .exec() -> cần mock trả về object có hàm exec
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TargetOrmRepository,
        // 2. Dùng getModelToken thay vì getRepositoryToken
        {
          provide: getModelToken(TargetEntity.name),
          useValue: mockTargetModel,
        },
      ],
    }).compile();

    repo = module.get<TargetOrmRepository>(TargetOrmRepository);
  });

  describe('save', () => {
    it('should persist entity using findByIdAndUpdate and return domain object', async () => {
      // Arrange
      const domain = TargetFactory.createNewTarget(
        'learner-1',
        new Score(450),
        new Date('2026-06-01'),
      );

      // Giả lập entity trả về từ DB sau khi update
      // Lưu ý: TargetEntity dùng _id, không phải id
      const ormEntityResult = {
        _id: domain.id,
        learnerId: 'learner-1',
        score: 450,
        targetDate: new Date('2026-06-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTargetModel.findByIdAndUpdate.mockResolvedValue(ormEntityResult);

      // Act
      const result = await repo.save(domain);

      // Assert
      // Kiểm tra xem findByIdAndUpdate có được gọi đúng tham số không
      expect(mockTargetModel.findByIdAndUpdate).toHaveBeenCalledWith(
        domain.id, // _id
        expect.objectContaining({ learnerId: 'learner-1' }), // data update
        { new: true, upsert: true }, // options
      );

      // Kiểm tra kết quả trả về đã được map sang Domain chưa
      expect(result.id).toBe(domain.id);
      expect(result.score?.value).toBe(450);
    });
  });

  describe('getOneByLearnerId', () => {
    it('should return domain Target when found', async () => {
      // Arrange
      const foundEntity = {
        _id: 'found-id',
        learnerId: 'learner-found',
        score: 300,
        targetDate: new Date('2026-07-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock chuỗi: findOne({..}).exec() -> trả về foundEntity
      mockTargetModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(foundEntity),
      });

      // Act
      const result = await repo.getOneByLearnerId('learner-found');

      // Assert
      expect(mockTargetModel.findOne).toHaveBeenCalledWith({
        learnerId: 'learner-found',
      });
      expect(result).not.toBeNull();
      expect(result!.id).toBe('found-id');
      expect(result!.score?.value).toBe(300);
    });

    it('should return null when not found', async () => {
      // Arrange
      // Mock chuỗi: findOne({..}).exec() -> trả về null
      mockTargetModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Act
      const result = await repo.getOneByLearnerId('missing-learner');

      // Assert
      expect(result).toBeNull();
    });
  });
});
