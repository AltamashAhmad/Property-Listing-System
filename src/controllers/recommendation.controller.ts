import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import Recommendation from '../models/recommendation.model';
import User from '../models/user.model';
import Property from '../models/property.model';

// Search users by email
export const searchUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email } = req.query;
    const currentUserId = req.user?._id;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email query parameter is required'
      });
    }

    // Find users whose email matches the search term (case-insensitive)
    // Exclude the current user from results
    const users = await User.find({
      email: { $regex: email as string, $options: 'i' },
      _id: { $ne: currentUserId }
    })
    .select('email name')
    .limit(5);

    res.json({
      success: true,
      data: users
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Send a property recommendation
export const sendRecommendation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { recipientId, propertyId, message } = req.body;
    const senderId = req.user?._id;

    // Validate recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Validate property exists
    const property = await Property.findOne({ id: propertyId });
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if recommendation already exists
    const existingRecommendation = await Recommendation.findOne({
      sender: senderId,
      recipient: recipientId,
      property: propertyId
    });

    if (existingRecommendation) {
      return res.status(400).json({
        success: false,
        message: 'You have already recommended this property to this user'
      });
    }

    // Create recommendation
    const recommendation = await Recommendation.create({
      sender: senderId,
      recipient: recipientId,
      property: propertyId,
      message
    });

    res.status(201).json({
      success: true,
      data: recommendation
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get recommendations received by the user
export const getReceivedRecommendations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const recommendations = await Recommendation.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name email')
      .lean();

    // Get property details separately since we use string IDs
    const propertyIds = recommendations.map(rec => rec.property);
    const properties = await Property.find({ id: { $in: propertyIds } }).lean();

    // Map properties to recommendations
    const recommendationsWithProperties = recommendations.map(rec => ({
      ...rec,
      property: properties.find(p => p.id === rec.property)
    }));

    const total = await Recommendation.countDocuments({ recipient: userId });

    res.json({
      success: true,
      data: recommendationsWithProperties,
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

// Mark recommendation as read
export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { recommendationId } = req.params;
    const userId = req.user?._id;

    const recommendation = await Recommendation.findOneAndUpdate(
      { _id: recommendationId, recipient: userId },
      { isRead: true },
      { new: true }
    );

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    res.json({
      success: true,
      data: recommendation
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 