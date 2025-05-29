import { Request, Response } from 'express';
import Property from '../models/property.model';
import { invalidatePropertyCache } from '../middleware/cache.middleware';

// Create a new property
export const createProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.create(req.body);
    // Invalidate cache after creating new property
    await invalidatePropertyCache(property.id);
    res.status(201).json({ success: true, data: property });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all properties with filtering, pagination, and sorting
export const getProperties = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt', ...filters } = req.query;
    const query: any = {};

    // Filtering
    if (filters.city) query.city = filters.city;
    if (filters.state) query.state = filters.state;
    if (filters.type) query.type = filters.type;
    if (filters.priceMin) query.price = { ...query.price, $gte: Number(filters.priceMin) };
    if (filters.priceMax) query.price = { ...query.price, $lte: Number(filters.priceMax) };
    if (filters.bedrooms) query.bedrooms = Number(filters.bedrooms);
    if (filters.bathrooms) query.bathrooms = Number(filters.bathrooms);
    if (filters.listingType) query.listingType = filters.listingType;
    if (filters.isVerified) query.isVerified = filters.isVerified === 'true';
    if (filters.furnished) query.furnished = filters.furnished;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Query
    const properties = await Property.find(query)
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit));
    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      data: properties,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get a single property by ID
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await Property.findOne({ id: req.params.id });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, data: property });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update a property
export const updateProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    // Invalidate cache after updating property
    await invalidatePropertyCache(property.id);
    res.json({ success: true, data: property });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a property
export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findOneAndDelete({ id: req.params.id });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    // Invalidate cache after deleting property
    await invalidatePropertyCache(property.id);
    res.json({ success: true, message: 'Property deleted' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}; 