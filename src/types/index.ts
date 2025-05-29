import { Request } from 'express';
import { IUser } from '../models/user.model';

export interface AuthRequest extends Request {
  user?: IUser;
}

export type PropertyType = 'Apartment' | 'Villa' | 'Bungalow' | 'Penthouse' | 'Studio';
export type FurnishedStatus = 'Furnished' | 'Semi' | 'Unfurnished';
export type ListedBy = 'Owner' | 'Agent' | 'Builder';
export type ListingType = 'rent' | 'sale'; 