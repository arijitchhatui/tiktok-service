import { config } from "dotenv";
config();

import express from "express";
import loginRouter from "./auth/auth.controller"
import reelsRouter from "./reels/reels.controller"
import morgan from "morgan";

const app = express();
declare module "express" {
  interface Request {
    user?: { userId: string };
  }
}

app.use(express.json());

app.use(morgan('dev'))


app.get("/", (req, res) => {
  res.json({ message: "OK" });
});

app.use(loginRouter, reelsRouter)

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
