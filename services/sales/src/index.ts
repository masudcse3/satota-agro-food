/** @format */

import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { getOrders, makeOrder, orderDetails, updateOrder } from "@/controllers";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});

// handle routes
app.patch("/checkout/:id", updateOrder);
app.post("/checkout", makeOrder);
app.get("/orders/order-details", orderDetails);
app.get("/orders", getOrders);
// 404 Error Hnadler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});
// global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "PrismaClientKnownRequestError") {
    console.log(err.stack);
    return res.status(403).json({ message: "Bad request" });
  }
  console.log(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const port = process.env.PORT || 5500;
const service_name = process.env.SERVICE_NAME || "sales";

app.listen(port, () => {
  console.log(`Server running on port ${port} for ${service_name} service`);
});
