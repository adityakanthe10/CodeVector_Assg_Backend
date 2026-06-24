// src/app.ts
import express, { Request, Response } from "express";
import { getDb } from "./Config/db"; // only need getDb for health route
import productRoutes from "./routes/productRoutes";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins: string[] = [
  "https://code-vector-assg-frontend.vercel.app",
  "https://codevector-assg-frontend.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
].filter((origin): origin is string => origin !== undefined);

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

// Handle CORS preflight for all routes (Express 5 syntax)
app.options("/{*path}", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
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

// ✅ EXPORT the app (no server startup here)
export default app;
