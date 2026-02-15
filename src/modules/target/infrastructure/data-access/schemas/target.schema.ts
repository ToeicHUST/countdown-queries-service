import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TargetDocument = HydratedDocument<TargetEntity>;

@Schema({ collection: 'target', timestamps: true })
export class TargetEntity {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, required: true, index: true })
  learnerId: string;

  @Prop({ type: Number, required: false, default: null })
  score: number | null;

  @Prop({ type: Date, required: false, default: null })
  targetDate: Date | null;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const TargetSchema = SchemaFactory.createForClass(TargetEntity);
