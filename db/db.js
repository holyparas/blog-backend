require("dotenv").config();
const pg = require("pg");

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// DROP TABLES (child → parent)
const DROP_COMMENTS = `DROP TABLE IF EXISTS comments CASCADE;`;
const DROP_POSTS = `DROP TABLE IF EXISTS posts CASCADE;`;
const DROP_USERS = `DROP TABLE IF EXISTS users CASCADE;`;

// CREATE TABLES
const SQL_USERS = `
  CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT,
    email TEXT,
    password TEXT
  );
`;

const SQL_POSTS = `
  CREATE TABLE IF NOT EXISTS posts(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT,
    post TEXT,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP
  );
`;

const SQL_COMMENTS = `
  CREATE TABLE IF NOT EXISTS comments(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    post_id INTEGER REFERENCES posts(id),
    comment TEXT,
    name TEXT,
    created_at TIMESTAMP
  );
`;

async function main() {
  try {
    console.log("dropping tables...");
    await pool.query(DROP_COMMENTS);
    await pool.query(DROP_POSTS);
    // await pool.query(DROP_USERS);

    console.log("creating tables...");
    await pool.query(SQL_USERS);
    await pool.query(SQL_POSTS);
    await pool.query(SQL_COMMENTS);

    console.log("done");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

// ⚠️ only call this when you actually want to reset DB
// main();

module.exports = pool;
