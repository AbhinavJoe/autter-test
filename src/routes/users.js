const express = require("express");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "invalid id" });
  }

  const { rows } = await db.query(
    "SELECT id, email, display_name, created_at FROM users WHERE id = $1",
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: "not found" });
  }
  return res.json(rows[0]);
});

module.exports = router;
