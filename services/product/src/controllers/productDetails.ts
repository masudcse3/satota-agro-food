/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";

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

    // find the stock details according to the id param
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
    const response = {
      product,
      pricingHistory,
    };

    //
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export default productDetails;
