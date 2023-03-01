import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import bodyParser from "body-parser";
import morgan from "morgan";
import tourRouter from "./routes/tourRoutes.js";
import mongoose from "mongoose";

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log("Connected to database");
  })
  .catch((e) => {
    console.log(e);
    console.log("Error connecting to database");
  });

  
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});

app.use("/api/v1/tours", tourRouter);

export default app;
