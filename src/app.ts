import express, { Request, Response } from "express";
import { connectDB, getDb } from "./Config/db";
import productRoutes from "./routes/productRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

// Health-check that verifies DB connectivity by pinging
app.get("/health", async (_req: Request, res: Response) => {
  try {
    const db = getDb();
    await db.admin().ping(); // Mongoose gives us the native driver db
    res.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      message: (error as Error).message,
    });
  }
});

// Product routes
app.use("/api/products", productRoutes);

async function start() {
  await connectDB(); // ensure connection before listening
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
  });
}

start();
