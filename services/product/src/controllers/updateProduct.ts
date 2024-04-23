/** @format */

import { Request, Response, NextFunction } from "express";
import { productUpdateSchema } from "@/schemas";
import prisma from "@/prisma";

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    console.log("Product Id", productId);
    const productExist = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!productExist) {
      return res.status(404).json({ message: "No product found for update" });
    }
    const parseData = productUpdateSchema.safeParse(req.body);
    if (!parseData.success) {
      return res.status(422).json({
        message: "Product validation failed",
        error: parseData.error.errors,
      });
    }

    const { name, weight, unit, retailPrice, wholesalePrice } = parseData.data;

    const updatedproduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name: name || productExist.name,
        weight: weight || productExist.weight,
        unit: unit || productExist.unit,
        wholesalePrice: wholesalePrice || productExist.wholesalePrice,
        retailPrice: retailPrice || productExist.retailPrice,
      },
    });
    await prisma.productPricingHistory.create({
      data: {
        wholesalePrice: wholesalePrice || productExist.wholesalePrice,
        retailPrice: retailPrice || productExist.retailPrice,
        product: {
          connect: {
            id: productExist.id,
          },
        },
      },
    });
    res.status(200).json({ data: updatedproduct });
  } catch (error) {
    next(error);
  }
};

export default updateProduct;
