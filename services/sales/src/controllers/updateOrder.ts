/** @format */

// step1: find the order to update
// step2: find the carts
// step3: validate the new data
// step4: fire an event to update the stock
// step5: update the

// senerio1: add new items
// senerio2: delete existing items
// senerio3: update the existing items quantity
import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { orderUpdateSchema } from "@/schemas";
import { fireEvent } from "@/fireEvent";

const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // find the order
    const order = await prisma.order.findUnique({ where: { id: id } });
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    // validate the new data
    const parseData = orderUpdateSchema.safeParse(req.body);
    if (!parseData.success) {
      return res.status(422).json({
        message: "validation failed.",
        error: parseData.error.errors,
      });
    }
    const { products, discount, paymentMethod, paid, soldBy } = parseData.data;

    const oldCart = await prisma.cart.findMany({ where: { orderId: id } });
    const newCart = products.map((product) => {
      return {
        productID: product.productID,
        productName: product.productName,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        totalPrice: product.quantity * product.unitPrice,
      };
    });
    console.log("OLD CART", oldCart);
    console.log("NEW CART", newCart);
    // generate the updated quantity for update the stock
    const increasedQuantities = oldCart
      .filter((oldItem) => {
        const newItem = newCart.find(
          (newItem) => newItem.productID === oldItem.productID
        );
        return newItem && newItem.quantity > oldItem.quantity;
      })
      .map((item) => {
        const newItem = newCart.find((i) => i.productID === item.productID);
        return {
          productID: item.productID,
          quantity: newItem ? newItem.quantity - item.quantity : 0,
        };
      });

    const decreasedQuantities = oldCart
      .filter((oldItem) => {
        const newItem = newCart.find(
          (newItem) => newItem.productID === oldItem.productID
        );
        return newItem && newItem.quantity < oldItem.quantity;
      })
      .map((item) => {
        const newItem = newCart.find((i) => i.productID === item.productID);
        return {
          productID: item.productID,
          quantity: newItem ? item.quantity - newItem.quantity : 0,
        };
      });
    const removedItems = oldCart
      .filter(
        (oldItem) =>
          !newCart.some((newItem) => newItem.productID === oldItem.productID)
      )
      .map((item) => ({ productID: item.productID, quantity: item.quantity }));

    const addedItems = newCart
      .filter(
        (newItem) =>
          !oldCart.some((oldItem) => oldItem.productID === newItem.productID)
      )
      .map((item) => ({ productID: item.productID, quantity: item.quantity }));

    const IN = decreasedQuantities.concat(removedItems);
    const OUT = increasedQuantities.concat(addedItems);

    console.log("SOULD IN", IN);
    console.log("SHOULD OUT", OUT);

    // clear the previous cart and add the new
    await prisma.cart.deleteMany({ where: { orderId: id } });
    await prisma.cart.createMany({
      data: newCart.map((item) => ({ ...item, orderId: id })),
    });

    // update the order
    const total = newCart.reduce((price, item) => {
      return price + item.totalPrice;
    }, 0);
    const grandTotal = total - discount;
    const due = grandTotal - paid;
    const updatedOrder = await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        total,
        grandTotal,
        discount,
        paymentMethod,
        paid,
        due,
        soldBy,
      },
    });
    // update the stock
    const stockIN = {
      products: IN,
      actionType: "IN",
    };
    await fireEvent(
      "update-stock-queue",
      "update-stock-exchange",
      JSON.stringify(stockIN)
    );
    const stockOUT = {
      products: OUT,
      actionType: "OUT",
    };
    await fireEvent(
      "update-stock-queue",
      "update-stock-exchange",
      JSON.stringify(stockOUT)
    );
    // todo: fire an event to update the accounts
    // todo: fire an event to send sms
    // todo: generate an invoice and send via email
    res.status(200).json({ data: updatedOrder });
  } catch (error) {
    next(error);
  }
};

export default updateOrder;
