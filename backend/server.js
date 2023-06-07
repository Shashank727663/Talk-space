const express = require("express");
const chat = require("./data/data");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

app.get("/", (req, res) => {
  res.send("API running");
});

const port = 5000;

app.get("/chat", (req, res) => {
  res.send(chat);
});

app.get("/chat/:id", (req, res) => {
  const singleChat = chat.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}!`);
});
