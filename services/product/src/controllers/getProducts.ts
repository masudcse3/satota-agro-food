/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { generatePagination, setOrGetCache } from "@/utils";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // /products?category='rice'

    const {
      product = "",
      category = "",
      page = 1,
      limit = 20,
    } = req.query as unknown as {
      category: string;
      product: string;
      page: number;
      limit: number;
    };

    // key = products?category=rice
    const key = `products?category=${category}&product=${product}&page=${page}&limit=${limit}`;
    const data = await setOrGetCache(key, async () => {
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
        orderBy: {
          createdAt: "desc",
        },
        skip: Number((page - 1) * limit),
        take: Number(limit),
      });
      const totalProducts = await prisma.product.count({
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
      });
      return {
        products,
        totalProducts,
      };
    });

    const pagination = generatePagination({
      totalItems: data.totalProducts,
      page,
      limit,
    });

    res.status(200).json({ data: data.products, pagination });
  } catch (error) {
    next(error);
  }
};

export default getProducts;
