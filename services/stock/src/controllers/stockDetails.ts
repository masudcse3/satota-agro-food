/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";

const stockDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { stockId } = req.params;
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
    const stock = await prisma.stockHistory.findMany({
      where: {
        AND: [
          {
            stockId,
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
    //
    res.status(200).json({ data: stock });
  } catch (err) {
    next(err);
  }
};

export default stockDetails;
