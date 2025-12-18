const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    console.log(req.body);

    const { name, password } = req.body;
    let { email } = req.body;
    email = email.toLowerCase();

    //check if user exists
    const checkUser = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: "email already exists" });
    }

    //hash password
    const hashedPass = await bcrypt.hash(password, 10);

    //insert user
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING name, email",
      [name, email, hashedPass]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase();

    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    //compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

    //sign jwt token (include name so front-end can display greeting)
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};
