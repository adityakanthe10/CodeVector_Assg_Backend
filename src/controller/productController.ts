import { Request, Response } from "express";
import { getProducts } from "../service/productService";

export async function productListHandler(req: Request, res: Response) {
  try {
    const { category, limit, lastCreatedAt, lastId } = req.query;

    // Parse limit as number (query string is always string or undefined)
    const parsedLimit = limit ? parseInt(limit as string, 10) : undefined;

    const result = await getProducts({
      category: category as string | undefined,
      limit: parsedLimit,
      lastCreatedAt: lastCreatedAt as string | undefined,
      lastId: lastId as string | undefined,
    });

    return res.json({
      success: true,
      data: result.data,
      nextCursor: result.nextCursor,
    });
  } catch (error: any) {
    if (
      error.message?.includes("Invalid lastCreatedAt") ||
      error.message?.includes("Invalid lastId")
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error("Product list error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
