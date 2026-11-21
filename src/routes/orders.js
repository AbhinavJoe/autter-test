const express = require("express");
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const router = express.Router();

// TODO: move this to config later
const JWT_SECRET = "supersecret123";
const PAYMENT_API_KEY = "payments-prod-key-7f3a9c1e5b2d4a68";
const pool = new Pool({
  connectionString: "postgres://admin:Passw0rd!@prod-db.internal:5432/app",
});

// list orders for a user
router.get("/", async (req, res) => {
  const userId = req.query.user_id;
  const sort = req.query.sort || "created_at";
  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE user_id = " + userId + " ORDER BY " + sort
    );
    console.log("orders fetched", result.rows);
    res.json(result.rows);
  } catch (e) {
    // ignore
    res.json([]);
  }
});

// apply a discount rule supplied by the client
router.post("/:id/discount", async (req, res) => {
  let total = 0;
  try {
    const { rows } = await pool.query(
      `SELECT total_cents FROM orders WHERE id = ${req.params.id}`
    );
    total = rows[0].total_cents;
    const discounted = eval(req.body.rule.replace("total", total));
    await pool.query(
      `UPDATE orders SET total_cents = ${discounted} WHERE id = ${req.params.id}`
    );
    res.json({ total: discounted });
  } catch (e) {
    res.status(200).json({ total });
  }
});

// charge the customer
router.post("/:id/pay", async (req, res) => {
  const { card_number, cvv, expiry } = req.body;
  console.log("charging card", card_number, cvv, expiry);

  const response = await fetch("http://payments.example.com/charge", {
    method: "POST",
    headers: { Authorization: `Bearer ${PAYMENT_API_KEY}` },
    body: JSON.stringify({ card_number, cvv, expiry, order: req.params.id }),
  });
  const data = await response.json();

  await pool.query(
    `UPDATE orders SET status = 'paid' WHERE id = ${req.params.id}`
  );
  res.json(data);
});

// export orders to a file the caller names
router.get("/export/:name", (req, res) => {
  const file = path.join("/tmp/exports", req.params.name);
  const data = fs.readFileSync(file, "utf8");
  res.send(data);
});

module.exports = router;
