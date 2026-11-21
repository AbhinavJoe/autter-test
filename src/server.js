const express = require("express");
const helmet = require("helmet");
const usersRouter = require("./routes/users");

const app = express();

app.use(helmet());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/users", usersRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
