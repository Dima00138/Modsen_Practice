import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import meetupsRoutes from "./routes/meetups"

const app = express();
const prisma = new PrismaClient();
app.use(bodyParser.json());
app.use(cors());

app.use(meetupsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});