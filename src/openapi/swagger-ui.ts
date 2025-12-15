import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { openapiDocument } from "./openapi";

export function setupSwagger(app: Express) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));
    app.get("/openapi.json", (req, res) => {
  res.json(openapiDocument);
});
}


