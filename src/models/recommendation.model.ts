import mongoose, { Schema, Document } from 'mongoose';

export interface IRecommendation extends Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  property: string;
  message?: string;
  createdAt: Date;
  isRead: boolean;
}

const recommendationSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: String,
    ref: 'Property',
    required: true
  },
  message: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

// Create indexes for better query performance
recommendationSchema.index({ recipient: 1, createdAt: -1 });
recommendationSchema.index({ sender: 1, createdAt: -1 });

export default mongoose.model<IRecommendation>('Recommendation', recommendationSchema); 