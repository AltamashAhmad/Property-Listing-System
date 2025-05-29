import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/property.model';
import path from 'path';

dotenv.config();

const importData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Delete existing data
    await Property.deleteMany({});
    console.log('Existing properties deleted');

    const results: any[] = [];

    // Read and parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(process.cwd(), 'db424fd9fb74_1748258398689.csv'))
        .pipe(csv())
        .on('data', (data) => {
          // Transform data as needed
          const property = {
            ...data,
            price: parseFloat(data.price),
            areaSqFt: parseFloat(data.areaSqFt),
            bedrooms: parseInt(data.bedrooms),
            bathrooms: parseInt(data.bathrooms),
            amenities: data.amenities ? data.amenities.split('|') : [],
            furnished: data.furnished === 'Semi' ? 'Semi' : 
                      data.furnished === 'Furnished' ? 'Furnished' : 'Unfurnished',
            availableFrom: new Date(data.availableFrom),
            tags: data.tags ? data.tags.split('|') : [],
            rating: parseFloat(data.rating),
            isVerified: data.isVerified.toLowerCase() === 'true'
          };
          results.push(property);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Insert data into MongoDB
    await Property.insertMany(results);
    console.log(`${results.length} properties imported successfully`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Run the import
importData(); 