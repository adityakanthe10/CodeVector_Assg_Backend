// src/index.ts
import app from "./app";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
import { connectDB } from "./Config/db";

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`💚 Health check: http://localhost:${PORT}/health`);
      console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
