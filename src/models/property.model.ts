import { Schema, model, Document } from 'mongoose';

export interface IProperty extends Document {
  id: string;
  title: string;
  type: string;
  price: number;
  state: string;
  city: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  furnished: 'Furnished' | 'Semi' | 'Unfurnished';
  availableFrom: Date;
  listedBy: 'Owner' | 'Agent' | 'Builder';
  tags: string[];
  colorTheme: string;
  rating: number;
  isVerified: boolean;
  listingType: 'rent' | 'sale';
  createdBy?: string; // This will be used later for user authentication
}

const PropertySchema = new Schema<IProperty>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    areaSqFt: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    amenities: [{ type: String }],
    furnished: { 
      type: String, 
      enum: ['Furnished', 'Semi', 'Unfurnished'],
      required: true 
    },
    availableFrom: { type: Date, required: true },
    listedBy: { 
      type: String,
      enum: ['Owner', 'Agent', 'Builder'],
      required: true 
    },
    tags: [{ type: String }],
    colorTheme: { type: String, required: true },
    rating: { type: Number, required: true },
    isVerified: { type: Boolean, required: true },
    listingType: { 
      type: String,
      enum: ['rent', 'sale'],
      required: true 
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
);

// Add indexes for frequently queried fields
PropertySchema.index({ city: 1, state: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ type: 1 });
PropertySchema.index({ listingType: 1 });
PropertySchema.index({ furnished: 1 });
PropertySchema.index({ isVerified: 1 });

export default model<IProperty>('Property', PropertySchema); 