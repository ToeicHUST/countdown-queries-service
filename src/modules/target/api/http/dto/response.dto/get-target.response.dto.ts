import { BaseResponseDto } from '@toeichust/common';

export interface DataGetTargetResponseDto {
  id: string;
  learnerId: string;
  score: number;
  targetDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class GetTargetResponseDto extends BaseResponseDto<DataGetTargetResponseDto> {}
