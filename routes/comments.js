const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// GET /api/comments -> return all comments
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM comments c JOIN posts ON p.id = c.post_id"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
