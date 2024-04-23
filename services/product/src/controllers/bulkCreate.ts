/** @format */

import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { z } from "zod";
import { productCreateSchema } from "@/schemas";
const bulkProductCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parseBody = z.array(productCreateSchema).safeParse(req.body);
    if (!parseBody.success) {
      return res.status(422).json({
        message: "Product validation failed",
        error: parseBody.error.errors,
      });
    }

    const productData = parseBody.data.map((product) => {
      return {
        name: product.name,
        weight: product.weight,
        unit: product.unit,
        wholesalePrice: product.wholesalePrice,
        retailPrice: product.retailPrice,
        category: product.category,
        currentStock: product.currentStock,
        source: product.source,
      };
    });
    console.log("Product Data", productData);

    const product_service_url =
      process.env.PRODUCT_SERVICE_URL || "http://localhost:4000";
    for (let i = 0; i < productData.length; i++) {
      await axios.post(`${product_service_url}/products`, {
        name: productData[i].name,
        weight: productData[i].weight,
        unit: productData[i].unit,
        wholesalePrice: productData[i].wholesalePrice,
        retailPrice: productData[i].retailPrice,
        category: productData[i].category,
        currentStock: productData[i].currentStock,
        source: productData[i].source,
      });
    }

    res.status(201).json({ message: "Products created successfully." });
  } catch (error) {
    next(error);
  }
};

export default bulkProductCreate;
