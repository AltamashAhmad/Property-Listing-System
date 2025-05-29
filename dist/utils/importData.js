"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const property_model_1 = __importDefault(require("../models/property.model"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const importData = async () => {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        // Delete existing data
        await property_model_1.default.deleteMany({});
        console.log('Existing properties deleted');
        const results = [];
        // Read and parse CSV file
        await new Promise((resolve, reject) => {
            fs_1.default.createReadStream(path_1.default.join(process.cwd(), 'db424fd9fb74_1748258398689.csv'))
                .pipe((0, csv_parser_1.default)())
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
        await property_model_1.default.insertMany(results);
        console.log(`${results.length} properties imported successfully`);
        // Disconnect from MongoDB
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
    }
    catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};
// Run the import
importData();
