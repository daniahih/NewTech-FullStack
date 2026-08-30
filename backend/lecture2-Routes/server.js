import express from "express";
import swaggerUi from "swagger-ui-express";
import movieRouter from "./routes/moiveRoutes.js";
import swaggerSpec from "./swagger.js";
const app = express();

app.use(express.json());
app.use("/movies", movieRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
