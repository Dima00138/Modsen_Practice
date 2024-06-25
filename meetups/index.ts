import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { PrismaClient } from "@prisma/client";
import meetupsRoutes from "./routes/meetups";
import authorizationRoutes from "./routes/authorization";
import session from 'express-session';
import cookieParser from "cookie-parser";

//settings
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: false }));


//swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Meetup API",
      version: "1.0.0",
      description: "API for managing meetups",
    },
  },
  apis: ["./components.yaml", "./routes/*.ts"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//routes
app.use(meetupsRoutes);
app.use(authorizationRoutes);

//setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});