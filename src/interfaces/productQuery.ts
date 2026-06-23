export interface ProductQueryParams {
  category?: string;
  limit?: number;
  lastCreatedAt?: string; // ISO string
  lastId?: string; // ObjectId hex string
}
