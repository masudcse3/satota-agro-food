/** @format */

import { Request, Response, NextFunction } from "express";
import { Customer } from "@/model";

const getCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name = "",
      phone = "",
      page = 1,
      limit = 20,
      sortBy = "updatedAt",
      sortType = "desc",
    } = req.query as unknown as {
      name: string;
      phone: string;
      page: number;
      limit: number;
      sortBy: string;
      sortType: string;
    };

    const filter = {
      name: {
        $regex: name,
        $options: "i",
      },
      phone: {
        $regex: phone,
        $options: "i",
      },
    };
    const sortStr = `${sortType === "desc" ? "-" : ""}${sortBy}`;

    const customers = await Customer.find(filter)
      .sort(sortStr)
      .skip(page * limit - limit)
      .limit(limit)
      .select("name email phone address type status");

    res.status(200).json({ data: customers });
  } catch (error) {
    next(error);
  }
};

export default getCustomers;
