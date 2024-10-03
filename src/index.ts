import { config } from "dotenv";
config();

import express from "express";


const app = express();
declare module "express" {
  interface Request {
    user?: { userId: string };
  }
}

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "OK" });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
