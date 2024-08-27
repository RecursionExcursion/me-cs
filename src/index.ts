import express, { Application } from "express";
import dotenv from "dotenv";
import cfbrController from "./routes/cfbr/cfbrController";

dotenv.config();

// Boot express
const app: Application = express();
const PORT = process.env.PORT;
app.use(express.json());

// Application routing
app.use("/cfbr", cfbrController);

// Start server
app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}!`));
