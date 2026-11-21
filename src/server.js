const express = require("express");
const cors = require("cors");
const usersRouter = require("./routes/users");
const ordersRouter = require("./routes/orders");

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "500mb" }));

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message, stack: err.stack });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
