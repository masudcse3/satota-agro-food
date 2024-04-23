/** @format */

import { Request, Response, NextFunction } from "express";
import { productCreateSchema } from "@/schemas";
import prisma from "@/prisma";
import { fireEvent } from "@/fireEvent";
import ShortUniqueId from "short-unique-id";
const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parseData = productCreateSchema.safeParse(req.body);
    if (!parseData.success) {
      return res.status(422).json({
        message: "Product validation failed",
        error: parseData.error.errors,
      });
    }
    const { randomUUID } = new ShortUniqueId({ length: 10 });
    // const sku = randomUUID();
    const {
      name,
      weight,
      unit,
      wholesalePrice,
      retailPrice,
      category,
      source,
      currentStock,
    } = parseData.data;
    const sku = parseData.data.sku || randomUUID();
    const productExist = await prisma.product.findUnique({
      where: {
        sku,
      },
    });

    if (productExist) {
      return res.status(400).json({ message: "Product already exists" });
    }
    const product = await prisma.product.create({
      data: {
        name,
        weight,
        unit,
        wholesalePrice,
        retailPrice,
        category,
        sku,
        currentStock,
        histories: {
          create: {
            retailPrice,
            wholesalePrice,
          },
        },
      },
    });
    // fire the event for creating a stock record
    const stockData = {
      ...product,
      source,
      currentStock,
    };
    await fireEvent(
      "create-stock-queue",
      "create-stock-exchange",
      JSON.stringify(stockData)
    );
    res.status(200).json({ data: product });
  } catch (error) {
    next(error);
  }
};

export default createProduct;
