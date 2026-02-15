import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TargetRepositoryPort } from '../../../core/application/ports/data-access/target.repository.port';
import { Target } from '../../../core/domain/entities/target';
import { DataAccessAdapter } from '../adapters/data-access.adapter';
import { TargetEntity } from '../schemas/target.schema';

@Injectable()
export class TargetOrmRepository implements TargetRepositoryPort {
  constructor(
    @InjectModel(TargetEntity.name)
    private readonly targetModel: Model<TargetEntity>,
  ) {}

  async save(entity: Target): Promise<Target> {
    const persistenceEntity = DataAccessAdapter.toPersistence(entity);

    const saved = await this.targetModel.findByIdAndUpdate(
      persistenceEntity._id,
      persistenceEntity,
      { new: true, upsert: true },
    );

    return DataAccessAdapter.toDomain(saved);
  }

  async getOneByLearnerId(learnerId: string): Promise<Target | null> {
    const found = await this.targetModel.findOne({ learnerId }).exec();
    if (!found) return null;
    return DataAccessAdapter.toDomain(found);
  }
}
