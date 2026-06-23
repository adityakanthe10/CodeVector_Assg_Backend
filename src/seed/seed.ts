// src/seed.ts
import { connectDB } from "../Config/db"; // your existing Mongoose connection helper
import mongoose from "mongoose";

// 1. Configuration
const TOTAL_PRODUCTS = 200_000;
const BATCH_SIZE = 10_000;

const CATEGORIES = ["Electronics", "Clothing", "Books", "Home", "Sports"];

// Helper to generate a random date within the last year
function randomDateWithinLastYear(): Date {
  const now = Date.now();
  const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;
  return new Date(oneYearAgo + Math.random() * (now - oneYearAgo));
}

// 2. Generate a single product document
function generateProduct(index: number) {
  const category = CATEGORIES[index % CATEGORIES.length];
  const price = parseFloat((Math.random() * 1000 + 5).toFixed(2)); // 5.00 – 1005.00
  const created = randomDateWithinLastYear();
  const updated = new Date(
    created.getTime() + Math.random() * (Date.now() - created.getTime()),
  );

  return {
    name: `Product ${index}`,
    category,
    price,
    created_at: created,
    updated_at: updated,
  };
}

async function seed() {
  console.time("Seeding");

  // 3. Connect to database
  await connectDB();
  const db = mongoose.connection.db!;
  const collection = db.collection("products");

  // 4. Clear existing data (optional – remove if you want to keep old data)
  console.log("🧹 Dropping existing products collection...");
  await collection.drop().catch(() => {
    // Ignore error if collection doesn't exist yet
  });

  // 5. Generate all documents in memory
  console.log(`📦 Generating ${TOTAL_PRODUCTS.toLocaleString()} products...`);
  const products = Array.from({ length: TOTAL_PRODUCTS }, (_, i) =>
    generateProduct(i),
  );

  // 6. Insert in batches
  console.log("💾 Inserting batches...");
  let inserted = 0;
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    await collection.insertMany(batch);
    inserted += batch.length;
    console.log(
      `   Batch ${inserted / BATCH_SIZE}/${Math.ceil(TOTAL_PRODUCTS / BATCH_SIZE)} inserted (${inserted} total)`,
    );
  }

  // 7. Create indexes
  console.log("📌 Creating indexes...");
  await collection.createIndex({ category: 1, created_at: -1, _id: -1 });
  await collection.createIndex({ created_at: -1, _id: -1 });

  console.log("✅ Seeding complete!");
  console.timeEnd("Seeding");

  // 8. Close connection
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
