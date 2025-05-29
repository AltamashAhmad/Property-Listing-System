# Property Listing System API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "password": "string"
}

Response 201:
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "token": "string"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response 200:
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "token": "string"
  }
}
```

## Properties

### Get Properties
```http
GET /properties?page=1&limit=10&sort=-createdAt&city=Mumbai&priceMin=1000000&priceMax=5000000&bedrooms=2&bathrooms=2&furnished=Furnished&listingType=sale

Response 200:
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "id": "string",
      "title": "string",
      "type": "string",
      "price": number,
      "state": "string",
      "city": "string",
      "areaSqFt": number,
      "bedrooms": number,
      "bathrooms": number,
      "amenities": ["string"],
      "furnished": "Furnished" | "Semi" | "Unfurnished",
      "availableFrom": "date",
      "listedBy": "Owner" | "Agent" | "Builder",
      "tags": ["string"],
      "colorTheme": "string",
      "rating": number,
      "isVerified": boolean,
      "listingType": "rent" | "sale"
    }
  ],
  "total": number,
  "page": number,
  "pages": number
}
```

### Get Property by ID
```http
GET /properties/:id

Response 200:
{
  "success": true,
  "data": {
    // Property object
  }
}
```

### Create Property
```http
POST /properties
Authorization: Bearer <token>
Content-Type: application/json

{
  // Property object without _id
}

Response 201:
{
  "success": true,
  "data": {
    // Created property object
  }
}
```

### Update Property
```http
PUT /properties/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  // Updated property fields
}

Response 200:
{
  "success": true,
  "data": {
    // Updated property object
  }
}
```

### Delete Property
```http
DELETE /properties/:id
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Property deleted successfully"
}
```

## Favorites

### Add to Favorites
```http
POST /favorites/:propertyId
Authorization: Bearer <token>

Response 201:
{
  "success": true,
  "data": {
    "_id": "string",
    "user": "string",
    "property": "string",
    "createdAt": "date"
  }
}
```

### Remove from Favorites
```http
DELETE /favorites/:propertyId
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Property removed from favorites"
}
```

### Get Favorites
```http
GET /favorites?page=1&limit=10
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "user": "string",
      "property": {
        // Property object
      },
      "createdAt": "date"
    }
  ],
  "total": number,
  "page": number,
  "pages": number
}
```

### Check Favorite Status
```http
GET /favorites/:propertyId/check
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "isFavorited": boolean
}
```

## Recommendations

### Search Users
```http
GET /recommendations/search-users?email=string
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "email": "string"
    }
  ]
}
```

### Send Recommendation
```http
POST /recommendations/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientId": "string",
  "propertyId": "string",
  "message": "string"
}

Response 201:
{
  "success": true,
  "data": {
    "_id": "string",
    "sender": "string",
    "recipient": "string",
    "property": "string",
    "message": "string",
    "isRead": boolean,
    "createdAt": "date"
  }
}
```

### Get Received Recommendations
```http
GET /recommendations/received?page=1&limit=10
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "sender": {
        "_id": "string",
        "name": "string",
        "email": "string"
      },
      "property": {
        // Property object
      },
      "message": "string",
      "isRead": boolean,
      "createdAt": "date"
    }
  ],
  "total": number,
  "page": number,
  "pages": number
}
```

### Mark Recommendation as Read
```http
PATCH /recommendations/:recommendationId/read
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": {
    // Updated recommendation object
  }
}
```

## Error Responses

### Validation Error
```http
Response 400:
{
  "success": false,
  "message": "Validation error message"
}
```

### Authentication Error
```http
Response 401:
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Not Found Error
```http
Response 404:
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Error
```http
Response 500:
{
  "success": false,
  "message": "Internal server error"
}
``` 