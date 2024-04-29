/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { setOrGetCache } from "@/utils";

const productDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const {
      from,
      to,
      page = 1,
      limit = 20,
    } = req.query as unknown as {
      from: string;
      to: string;
      page: number;
      limit: number;
    };

    // find the product details according to the id param and search the price updates based on the timestamp
    // key: products/123er454id
    const key = `products/${productId}`;
    const data = await setOrGetCache(key, async () => {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
      const pricingHistory = await prisma.productPricingHistory.findMany({
        where: {
          AND: [
            {
              productId,
            },
            {
              createdAt: {
                gte: from,
                lte: to,
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: Number((page - 1) * limit),
        take: Number(limit),
      });
      return {
        product,
        pricingHistory,
      };
    });

    //
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export default productDetails;
