const express = require("express");
const Redis = require("redis");

const app = express();
const redisClient = Redis.createClient({
  host: "redis",
  port: 6379,
});

redisClient.on("error", (err) => console.log("Redis Server Error", err));

redisClient.on("connect", () => {
  console.log("Connected to Redis server");
});

redisClient.on("error", (err) => {
  console.error("Redis server error", err);
});

redisClient.connect();

app.use(express.json({ limit: "50mb" }));

app.get("/messages", async (req, res) => {
  const messages = await redisClient
    .lRange("messages", 0, -1)
    .catch((err) => console.log(err));
  res.json({ messages });
});

app.post("/messages", async (req, res) => {
  const newMessage = req.body.message;
  await redisClient
    .lPush("messages", newMessage)
    .catch((err) => console.log(err));
  res.json({ message: "Message has been posted succesfully." });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
