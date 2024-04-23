/** @format */

import express, { Request, Response, NextFunction } from "express";
import http from "http";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./db";

import {
  changePassword,
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "@/controllers";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});

// handle routes
app.patch("/customers/:id", updateCustomer);
app.patch("/changepassword/:id", changePassword);
app.delete("/customers/:id", deleteCustomer);
app.get("/customers", getCustomers);
app.post("/customers", createCustomer);
// 404 Error Hnadler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});
// global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const port = process.env.PORT || 3300;
const service_name = process.env.SERVICE_NAME || "customer";
const server = http.createServer(app);
const main = async () => {
  try {
    await dbConnection();
    server.listen(port, () => {
      console.log(`Server running on port ${port} for ${service_name} service`);
    });
  } catch (error) {
    console.error("[Error]:", error);
  }
};
main();
