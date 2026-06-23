import { Router } from "express";
import { productListHandler } from "../controller/productController";

const router = Router();

// GET /api/products
router.get("/", productListHandler);

export default router;
