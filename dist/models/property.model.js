"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PropertySchema = new mongoose_1.Schema({
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
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});
// Add indexes for frequently queried fields
PropertySchema.index({ city: 1, state: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ type: 1 });
PropertySchema.index({ listingType: 1 });
PropertySchema.index({ furnished: 1 });
PropertySchema.index({ isVerified: 1 });
exports.default = (0, mongoose_1.model)('Property', PropertySchema);
