// src/app.ts
import express, { Request, Response } from "express";
import { getDb } from "./Config/db";
import productRoutes from "./routes/productRoutes";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============ CORS CONFIGURATION ============
const allowedOrigins: string[] = [
  "https://code-vector-assg-frontend.vercel.app",
  "https://codevector-assg-frontend.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
].filter((origin): origin is string => origin !== undefined);

// Add environment variable if it exists
if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(process.env.CORS_ORIGIN);
}

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Headers",
  ],
  exposedHeaders: ["Content-Length", "X-Kuma-Revision"],
  maxAge: 86400,
};

// Apply CORS middleware BEFORE any routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ============ MIDDLEWARE ============
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ ROUTES ============

app.get("/health", async (_req: Request, res: Response) => {
  try {
    const db = getDb();
    await db.admin().ping();
    res.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
      cors: "enabled",
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      message: (error as Error).message,
    });
  }
});

app.get("/", (_req: Request, res: Response) => {
  res.send(`Hi there, backend running on port ${PORT}. CORS enabled.`);
});

app.use("/api", productRoutes);

export default app;
