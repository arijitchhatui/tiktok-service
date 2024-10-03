import { MongoClient } from "mongodb";
import { Collections } from "../util/constants";

const client = new MongoClient(process.env.MONGODB_URL!);

export const db = client.db("tiktok");

(async () => {
  db.collection(Collections.USERS).createIndex(
    {
      email: 1,
    },
    { unique: true }
  );
  db.collection(Collections.PROFILES).createIndex(
    {
      userId: 1,
    },
    { unique: true }
  );
})();
