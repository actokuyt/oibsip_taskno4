const express = require("express");
const bcrypt = require("bcrypt");

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

let users = [];

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  let { username, password } = req.body;

  let isRegistered = users.find((user => user.username === username));
  if (isRegistered) {
    res.status(409).json({"message": "already registered"});
  }else{
    let hashedPassword = await bcrypt.hash(password, 10);

    let user = {
      username: username,
      password: hashedPassword,
    };
  
    users.push(user);
    res.status(200).json({ message: "user successfully registered" });
  }
});

app.post("/login", async (req, res) => {
  let { username, password } = req.body;

  let user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  try {
    let isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(403).json({message: "bad credentials"});
    } else {
      res.render("dashboard");
    }
  } catch (error) {
    return res.status(500).send("internal server error");
  }
});

app.listen(5000, () => {
  console.log("server is active");
});
