/** @format */

import { Request, Response, NextFunction } from "express";
import { createStockHistorySchema } from "@/schemas";
import prisma from "@/prisma";
import { fireEvent } from "@/fireEvent";
const updateStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stockId = req.params.stockId;
    const stockExists = await prisma.stock.findFirst({
      where: { id: stockId },
    });
    if (!stockExists) {
      return res.status(404).json({ message: "Stock not found" });
    }
    const parseData = createStockHistorySchema.safeParse(req.body);
    if (!parseData.success) {
      return res.status(422).json({
        message: "Data validation failed",
        error: parseData.error.errors,
      });
    }
    const { actionType, quantity, source } = parseData.data;

    await prisma.stockHistory.create({
      data: {
        actionType,
        quantity,
        lastStock: stockExists.currentStock,
        currentStock:
          actionType === "IN"
            ? stockExists.currentStock + quantity
            : stockExists.currentStock - quantity,
        source,
        stock: {
          connect: {
            id: stockId,
          },
        },
      },
    });

    const updatedStock = await prisma.stock.update({
      where: { id: stockId },
      data: {
        currentStock:
          actionType === "IN"
            ? stockExists.currentStock + quantity
            : stockExists.currentStock - quantity,
      },

      include: {
        histories: true,
      },
    });
    const updateProductStockPayload = {
      productId: updatedStock.productId,
      currentStock: updatedStock.currentStock,
    };
    await fireEvent(
      "update-product-stock-queue",
      "update-product-stock-exchange",
      JSON.stringify(updateProductStockPayload)
    );
    res.status(200).json({ data: updatedStock });
  } catch (error) {
    next(error);
  }
};

export default updateStock;
