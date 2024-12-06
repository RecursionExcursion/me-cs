import express, { Application } from "express";
import dotenv from "dotenv";
import cfbrRoutes from "./routes/cfbr/cfbrRoutes";
import compression from "compression";

dotenv.config();

// Boot express
const app: Application = express();
const PORT = process.env.PORT;
app.use(express.json());

//Gzip
app.use(compression());

// Application routing
app.use("/cfbr", cfbrRoutes);

// Start server
app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}!`));

//TODO Create win probability route
//TODO Create betting line route
