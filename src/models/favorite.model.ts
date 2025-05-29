import { Schema, model } from 'mongoose';

interface IFavorite {
  user: Schema.Types.ObjectId;
  property: string;  // Property ID
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: String,
    ref: 'Property',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can't favorite the same property twice
FavoriteSchema.index({ user: 1, property: 1 }, { unique: true });

// Index for quick lookups by user
FavoriteSchema.index({ user: 1, createdAt: -1 });

export default model<IFavorite>('Favorite', FavoriteSchema); 