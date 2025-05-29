const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the WHRISTORIUM API",
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

n