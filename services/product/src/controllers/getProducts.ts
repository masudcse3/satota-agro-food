/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { generatePagination } from "@/utils";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // /products?category='rice'

    const {
      product,
      category,
      page = 1,
      limit = 20,
    } = req.query as unknown as {
      category: string;
      product: string;
      page: number;
      limit: number;
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
    const pagination = generatePagination({
      totalItems: totalProducts,
      page,
      limit,
    });
    res.status(200).json({ data: products, pagination });
  } catch (error) {
    next(error);
  }
};

export default getProducts;
