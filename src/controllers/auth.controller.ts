import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HydratedDocument } from 'mongoose';
import User, { IUser } from '../models/user.model';

// Generate JWT Token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    console.log('Registration request received:', req.body);
    const { email, password, name } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    console.log('User exists check:', userExists ? 'Yes' : 'No');
    
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    console.log('Creating new user...');
    const user: HydratedDocument<IUser> = await User.create({
      name,
      email,
      password
    });
    console.log('User created successfully:', user._id);

    // Generate token
    const token = generateToken(user._id.toString());
    console.log('Token generated successfully');

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;

    // Check for user
    const user: HydratedDocument<IUser> | null = await User.findOne({ email }).exec();
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id.toString());
    console.log('Token generated successfully');

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 