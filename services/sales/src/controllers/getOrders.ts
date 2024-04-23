/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 20,
      from,
      to,
    } = req.query as unknown as {
      page: number;
      limit: number;
      from: string;
      to: string;
    };

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      include: {
        products: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: Number((page - 1) * limit),
      take: Number(limit),
    });
    const totalOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
      },
    });
    const totalPages = Math.ceil(totalOrders / limit);
    const nextPage = page < totalPages ? Number(page) + 1 : NaN;
    const prevPage = page > 1 && page <= totalPages ? page - 1 : NaN;
    const response = {
      data: orders,
      pagination: {
        totalOrders,
        currentPage: Number(page),
        totalPages,
        nextPage,
        prevPage,
        limit: Number(limit),
      },
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export default getOrders;