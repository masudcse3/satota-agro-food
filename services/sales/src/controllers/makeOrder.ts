/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { orderSchema, cartSchema } from "@/schemas";
import { fireEvent } from "@/fireEvent";

const makeOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseData = orderSchema.safeParse(req.body);
    if (!parseData.success) {
      return res.status(422).json({
        message: "validation failed.",
        error: parseData.error.errors,
      });
    }
    // {products: [{productID: 1, quantity:2, unitPrice: 200}, {productID: 2, quantity:3, unitPrice:400}], }
    const { customerID, products, discount, paymentMethod, paid, soldBy } =
      parseData.data;
    const cartItems = products.map((product) => {
      return {
        productID: product.productID,
        productName: product.productName,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        totalPrice: product.quantity * product.unitPrice,
      };
    });

    const total = cartItems.reduce((price, item) => {
      return price + item.totalPrice;
    }, 0);
    const grandTotal = total - discount;
    const due = grandTotal - paid;
    const order = await prisma.order.create({
      data: {
        customerID,
        total,
        grandTotal,
        discount,
        paymentMethod,
        paid,
        due,
        soldBy,
        products: {
          createMany: {
            data: cartItems,
          },
        },
      },
    });

    //  fire an event to update the stock
    const payload = {
      products,
      actionType: "OUT",
    };
    await fireEvent(
      "update-stock-queue",
      "update-stock-exchange",
      JSON.stringify(payload)
    );
    // todo: fire an event to update the accounts
    // todo: fire an event to send sms
    // todo: generate an invoice and send via email
    res.status(201).json({ data: order });
  } catch (error) {
    next(error);
  }
};

export default makeOrder;
