import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Auth, CurrentUserId } from '@toeichust/common';
import { GetTargetByLearnerIdQuery } from '../../../core/application/queries/get-target-by-learner-id.query';
import { GetTargetResponseDto } from '../dto/response.dto/get-target.response.dto';

@Controller('target')
export class TargetController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @Auth.User()
  async getTarget(
    @CurrentUserId() learnerId: string,
  ): Promise<GetTargetResponseDto> {
    const target = await this.queryBus.execute(
      new GetTargetByLearnerIdQuery(learnerId),
    );

    if (!target) {
      return new GetTargetResponseDto({
        message: 'No target found for the learner',
      });
    }

    return new GetTargetResponseDto({
      message: 'Get Target successfully',
      data: {
        id: target?.id,
        learnerId: target?.learnerId,
        score: target?.score?.value,
        targetDate: target?.targetDate,
        createdAt: target?.createdAt,
        updatedAt: target?.updatedAt,
      },
    });
  }
}
