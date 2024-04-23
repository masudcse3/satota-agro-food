/** @format */

import mongoose from "mongoose";
export const dbConnection = async () => {
  try {
    const connection_url: string =
      process.env.DB_CONNECTION_URL ||
      "mongodb://masud:amcmsd396@localhost:27017";
    const db = process.env.DB_NAME || "customer";
    await mongoose.connect(connection_url, {
      dbName: db,
      serverSelectionTimeoutMS: 1000,
    });
    console.log("Database Connected");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};
