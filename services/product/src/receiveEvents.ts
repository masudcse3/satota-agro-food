/** @format */

import { receiveEventFromQueue } from "@/utils";
import prisma from "@/prisma";
receiveEventFromQueue(
  "update-product-stock-queue",
  "update-product-stock-exchange",
  async (message) => {
    const data = JSON.parse(message);
    console.log("Update Product Stock Exchange");
    console.log(data);
    await prisma.product.update({
      where: {
        id: data.productId,
      },
      data: {
        currentStock: data.currentStock,
      },
    });
  }
);
