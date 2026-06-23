import { Product, IProduct } from "../models/products";
import { ProductQueryParams } from "../interfaces/productQuery";
import mongoose from "mongoose";

interface PaginatedResult {
  data: IProduct[];
  nextCursor: {
    created_at: Date;
    _id: string;
  } | null;
}

export async function getProducts(
  params: ProductQueryParams,
): Promise<PaginatedResult> {
  const { category, limit: rawLimit = 20, lastCreatedAt, lastId } = params;

  const limit = Math.min(Math.max(rawLimit, 1), 100);
  const sortOrder: Record<string, -1> = { created_at: -1, _id: -1 };

  const filter: any = {};

  if (category) {
    filter.category = category;
  }

  if (lastCreatedAt && lastId) {
    const parsedDate = new Date(lastCreatedAt);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid lastCreatedAt"); // Removed extra text
    }
    if (!mongoose.Types.ObjectId.isValid(lastId)) {
      throw new Error("Invalid lastId"); // Removed extra text
    }

    const cursorCondition = {
      $or: [
        { created_at: { $lt: parsedDate } },
        {
          created_at: parsedDate,
          _id: { $lt: new mongoose.Types.ObjectId(lastId) },
        },
      ],
    };

    if (Object.keys(filter).length > 0) {
      filter.$and = [cursorCondition, { ...filter }];
      delete filter.category;
    } else {
      Object.assign(filter, cursorCondition);
    }
  }

  const docs = await Product.find(filter)
    .sort(sortOrder)
    .limit(limit + 1)
    .lean();

  const hasMore = docs.length > limit;
  if (hasMore) {
    docs.pop();
  }

  const nextCursor = hasMore
    ? {
        created_at: docs[docs.length - 1].created_at,
        _id: docs[docs.length - 1]._id.toString(),
      }
    : null;

  return {
    data: docs,
    nextCursor,
  };
}
