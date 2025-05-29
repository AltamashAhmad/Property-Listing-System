import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import Favorite from '../models/favorite.model';
import Property from '../models/property.model';
import { invalidatePropertyCache } from '../middleware/cache.middleware';

// Add a property to favorites
export const addToFavorites = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { propertyId } = req.params;

    // Check if property exists
    const property = await Property.findOne({ id: propertyId });
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Create favorite
    const favorite = await Favorite.create({
      user: userId,
      property: propertyId
    });

    // Invalidate cache for this property
    await invalidatePropertyCache(propertyId);

    res.status(201).json({
      success: true,
      data: favorite
    });
  } catch (error: any) {
    // Handle duplicate favorite
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Property already in favorites'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Remove a property from favorites
export const removeFromFavorites = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { propertyId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      property: propertyId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    // Invalidate cache for this property
    await invalidatePropertyCache(propertyId);

    res.json({
      success: true,
      message: 'Property removed from favorites'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get user's favorite properties
export const getFavorites = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const favorites = await Favorite.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get property details for each favorite
    const propertyIds = favorites.map(fav => fav.property);
    const properties = await Property.find({ id: { $in: propertyIds } }).lean();

    // Map properties to favorites
    const favoritesWithProperties = favorites.map(fav => ({
      ...fav,
      property: properties.find(p => p.id === fav.property)
    }));

    const total = await Favorite.countDocuments({ user: userId });

    res.json({
      success: true,
      data: favoritesWithProperties,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Check if a property is favorited by the user
export const checkFavorite = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { propertyId } = req.params;

    const favorite = await Favorite.findOne({
      user: userId,
      property: propertyId
    });

    res.json({
      success: true,
      isFavorited: !!favorite
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 