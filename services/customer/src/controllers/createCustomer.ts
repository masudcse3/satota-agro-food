/** @format */

import { Request, Response, NextFunction } from "express";
import { Customer } from "@/model";
import { createCustomerSchema } from "@/schemas";
import bcryptjs from "bcryptjs";

const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parseData = createCustomerSchema.safeParse(req.body);
  if (!parseData.success) {
    return res.status(422).json({
      message: "Data validation failed",
      error: parseData.error.errors,
    });
  }

  try {
    const { name, email, phone, address, password, image, type, status } =
      parseData.data;
    const customerExists = await Customer.findOne({ phone: phone });
    if (customerExists) {
      return res.status(403).json({ message: "Customer already exists" });
    }
    // hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    // create the customer
    const customer = new Customer({
      ...parseData.data,
      password: hashedPassword,
    });
    await customer.save();
    // todo: send the login credentials to customer's phone number
    res.status(201).json({ data: customer });
  } catch (error) {
    next(error);
  }
};

export default createCustomer;
