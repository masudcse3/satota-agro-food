/** @format */
import { receiveEventFromQueue } from "@/utils";
import prisma from "@/prisma";
import { fireEvent } from "./fireEvent";
import axios from "axios";
receiveEventFromQueue(
  "create-stock-queue",
  "create-stock-exchange",
  async (message) => {
    const data = JSON.parse(message);
    const { id, name, sku, source, currentStock, category } = data;
    await prisma.stock.create({
      data: {
        productId: id,
        productName: name,
        sku: sku,
        currentStock: currentStock,
        category: category,
        histories: {
          create: {
            quantity: currentStock,
            currentStock: currentStock,
            source,
          },
        },
      },
    });
    console.log("Stock created successfully");
  }
);

// delete stock
receiveEventFromQueue(
  "delete-stock-queue",
  "delete-stock-exchange",
  async (message) => {
    try {
      const productId = JSON.parse(message);
      await prisma.stock.delete({ where: { productId } });
      console.log("Stock deleted successfully");
    } catch (error) {
      console.log("[Stock Delete on product delete]:", error);
    }
  }
);
// check stock and return the stock
receiveEventFromQueue(
  "check-stock-queue",
  "check-stock-exchange",
  async (message) => {
    const data = JSON.parse(message);
    console.log("PRODUCT IDS", data);
    // ['12', '23']
    const stocks = await prisma.stock.findMany({
      where: {
        productId: {
          in: data,
        },
      },
      select: {
        productId: true,
        currentStock: true,
      },
    });
    console.log("STOCKS", stocks);
    await fireEvent(
      "send-stock-queue",
      "send-stock-exchange",
      JSON.stringify(stocks)
    );
  }
);
// update the stock
receiveEventFromQueue(
  "update-stock-queue",
  "update-stock-exchange",
  async (message) => {
    const { products: data, actionType } = JSON.parse(message);

    const stockIds = await prisma.stock.findMany({
      where: {
        productId: {
          in: data.map((item) => item.productID),
        },
      },
      select: {
        id: true,
        productId: true,
      },
    });
    const rearrangedStocks = data.map((item) =>
      stockIds.find((stock) => stock.productId === item.productID)
    );
    // ['10', '20', '30']
    // [{id: '2', productId:'20'}, {id: '3', productId:'30'}, {id: '1', productId:'10'}]

    for (let i = 0; i < rearrangedStocks.length; i++) {
      await axios.patch(
        `${process.env.SERVICE_URL}/stocks/${rearrangedStocks[i].id}`,
        {
          actionType,
          quantity: data[i].quantity,
          source: "SALES",
        }
      );
    }
  }
);
