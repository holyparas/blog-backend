const pool = require("../db/db");

const getComments = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM comments c JOIN posts ON posts.id = c.post_id WHERE posts.id = $1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "comment  not found" });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};

const getPostsById = async (req, res) => {
  const { id } = req.params;
  console.log("id: ", id);

  try {
    const { rows } = await pool.query(
      `
      SELECT 
        posts.id AS post_id,
        posts.title,
        posts.post,
        posts.created_at,
        users.id AS user_id,
        users.name AS author_name,
        users.email AS author_email
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.id = $1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "post not found" });
    }

    console.log("rows: ", rows);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};

const getPosts = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT posts.id AS post_id,posts.title,posts.post,posts.created_at,users.id AS user_id,users.name AS author_name,users.email AS author_email FROM posts JOIN users ON posts.user_id = users.id"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};

const createPost = async (req, res) => {
  const { title, post, userID, date } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO posts (title, post,user_id, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, post, userID, date]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};

const createComment = async (req, res) => {
  const { id } = req.params;
  const { comment, name, created_at } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO comments (post_id, comment, name, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, comment, name, created_at]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error" });
  }
};

module.exports = {
  getPosts,
  createPost,
  createComment,
  getPostsById,
  getComments,
};
