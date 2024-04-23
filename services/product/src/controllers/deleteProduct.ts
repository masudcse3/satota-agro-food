/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { fireEvent } from "@/fireEvent";
const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.productId;
    const productExist = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!productExist) {
      return res.status(404).json({ message: "No product found for delete" });
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    // fire an event to delete the relavant stock
    await fireEvent(
      "delete-stock-queue",
      "delete-stock-exchange",
      JSON.stringify(productId)
    );
    res.status(200).json({ message: "Product delete successfully" });
  } catch (error) {
    next(error);
  }
};

export default deleteProduct;
