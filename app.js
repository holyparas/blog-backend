require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: [
    "https://blogpublictop.netlify.app",
    "https://blogauthortop.netlify.app",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

//handling pre-flight request
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

app.get("/hello", (req, res) => {
  res.json({ msg: "HELLO API" });
});

const postsAPI = require("./routes/posts");

//fetch posts & comments
app.use("/api/posts", postsAPI);

//setup auth login
const authRoute = require("./routes/auth");
app.use("/api/auth", authRoute);

app.listen(process.env.PORT, () => console.log("Server running on PORT 3000"));
