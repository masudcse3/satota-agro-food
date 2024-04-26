/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { generatePagination } from "@/utils";

const orderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      orderId,
      customerId,
      page = 1,
      limit = 20,
      from,
      to,
    } = req.query as unknown as {
      orderId: string;
      customerId: string;
      page: number;
      limit: number;
      from: string;
      to: string;
    };
    let idQuery = {};
    if (orderId) {
      idQuery = {
        id: orderId,
      };
    } else if (customerId) {
      idQuery = {
        customerID: customerId,
      };
    }
    const orders = await prisma.order.findMany({
      where: {
        AND: [
          idQuery,
          {
            createdAt: {
              gte: from,
              lte: to,
            },
          },
        ],
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

    const totalOrders = await prisma.order.count({ where: idQuery });
    const pagination = generatePagination({
      totalItems: totalOrders,
      page,
      limit,
    });

    res.status(200).json({ data: orders, pagination });
  } catch (error) {
    next(error);
  }
};

export default orderDetails;
