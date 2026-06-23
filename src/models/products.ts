import mongoose, { Schema, Document } from "mongoose";

// 1. TypeScript interface for a Product document
export interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
  created_at: Date;
  updated_at: Date;
}

// 2. Mongoose schema
const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
  },
  {
    // Let MongoDB generate _id automatically
    // versionKey: false, // optional: remove __v
    timestamps: false, // we already have created_at/updated_at manually
  },
);

// 3. Indexes are already created by seed, but we can also define them here
// (they won't be re-created if they exist, but it documents them)
ProductSchema.index({ category: 1, created_at: -1, _id: -1 });
ProductSchema.index({ created_at: -1, _id: -1 });

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
