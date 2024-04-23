/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // /products?category='rice'
    const { product, category } = req.query as {
      category: string;
      product: string;
    };
    const products = await prisma.product.findMany({
      where: {
        category: {
          contains: category,
          mode: "insensitive",
        },
        name: {
          contains: product,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        weight: true,
        unit: true,
        sku: true,
        wholesalePrice: true,
        retailPrice: true,
        category: true,
        currentStock: true,
      },
    });

    res.status(200).json({
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export default getProducts;
