/** @format */
import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";

const getStocks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, product } = req.query as {
      category: string;
      product: string;
    };
    const stocks = await prisma.stock.findMany({
      where: {
        category: {
          contains: category,
          mode: "insensitive",
        },
        productName: {
          contains: product,
          mode: "insensitive",
        },
      },
    });

    res.status(200).json({ data: stocks });
  } catch (err) {
    next(err);
  }
};
export default getStocks;
