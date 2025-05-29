# Property Listing System

A robust RESTful API for a property listing system built with Node.js, TypeScript, MongoDB, and Redis.

## Features

### Core Features
- **Property Management**: Complete CRUD operations for property listings
- **Advanced Search**: Filter properties by multiple parameters (price, location, amenities, etc.)
- **User Authentication**: Secure JWT-based authentication system
- **Favorites System**: Allow users to save and manage their favorite properties
- **Redis Caching**: Improved performance with Redis caching for frequently accessed data

### Bonus Features
- **Property Recommendations**: Users can recommend properties to other users
- **Read Status Tracking**: Track whether recommendations have been read
- **User Search**: Search users by email to send recommendations
- **Property Sharing**: Share property details with personalized messages

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Caching**: Redis
- **Authentication**: JWT
- **Password Hashing**: bcrypt
- **API Documentation**: Postman Collection

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd property-listing-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/property-listing
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

4. Start the development server:
```bash
npm run dev
```

## API Documentation

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/register`
- Body: `{ "name": "string", "email": "string", "password": "string" }`

#### Login
- **POST** `/api/auth/login`
- Body: `{ "email": "string", "password": "string" }`

### Property Endpoints

#### Get Properties
- **GET** `/api/properties`
- Query Parameters:
  - `page`: number
  - `limit`: number
  - `sort`: string
  - `city`: string
  - `state`: string
  - `type`: string
  - `priceMin`: number
  - `priceMax`: number
  - `bedrooms`: number
  - `bathrooms`: number
  - `furnished`: string
  - `listingType`: string

#### Get Property by ID
- **GET** `/api/properties/:id`

#### Create Property
- **POST** `/api/properties`
- Protected Route
- Requires Authentication

#### Update Property
- **PUT** `/api/properties/:id`
- Protected Route
- Requires Authentication

#### Delete Property
- **DELETE** `/api/properties/:id`
- Protected Route
- Requires Authentication

### Favorites Endpoints

#### Add to Favorites
- **POST** `/api/favorites/:propertyId`
- Protected Route

#### Remove from Favorites
- **DELETE** `/api/favorites/:propertyId`
- Protected Route

#### Get Favorites
- **GET** `/api/favorites`
- Protected Route

#### Check Favorite Status
- **GET** `/api/favorites/:propertyId/check`
- Protected Route

### Recommendation Endpoints

#### Search Users
- **GET** `/api/recommendations/search-users`
- Query Parameters:
  - `email`: string
- Protected Route

#### Send Recommendation
- **POST** `/api/recommendations/send`
- Body: `{ "recipientId": "string", "propertyId": "string", "message": "string" }`
- Protected Route

#### Get Received Recommendations
- **GET** `/api/recommendations/received`
- Query Parameters:
  - `page`: number
  - `limit`: number
- Protected Route

#### Mark Recommendation as Read
- **PATCH** `/api/recommendations/:recommendationId/read`
- Protected Route

## Data Models

### User Model
```typescript
{
  email: string;
  password: string;
  name: string;
  favorites: ObjectId[];
  recommendations: {
    property: ObjectId;
    from: ObjectId;
    date: Date;
  }[];
}
```

### Property Model
```typescript
{
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
  createdBy?: ObjectId;
}
```

### Recommendation Model
```typescript
{
  sender: ObjectId;
  recipient: ObjectId;
  property: string;
  message?: string;
  createdAt: Date;
  isRead: boolean;
}
```

## Error Handling

The API uses consistent error response format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Caching Strategy

- Property listings are cached for 5 minutes
- Individual property details are cached for 15 minutes
- Search results are cached for 2 minutes
- Cache is invalidated when related data is modified

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected routes using authentication middleware
- Input validation and sanitization
- Rate limiting (optional)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 