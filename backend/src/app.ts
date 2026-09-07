import express from "express";
import cors from "cors";
import { config } from "./config";
import { errorHandler } from "./middleware/error";
import { authRouter } from "./routes/auth";
import { usersRouter } from "./routes/users";
import { categoriesRouter, productsRouter } from "./routes/catalog";
import { ordersRouter } from "./routes/orders";
import { notificationsRouter } from "./routes/notifications";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.corsOrigin,
      exposedHeaders: ["X-Total-Count"],
    }),
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use(authRouter);
  app.use("/users", usersRouter);
  app.use("/categories", categoriesRouter);
  app.use("/products", productsRouter);
  app.use("/orders", ordersRouter);
  app.use("/notifications", notificationsRouter);

  app.use(errorHandler);
  return app;
}
