// simple_server.js
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import { dirname } from "path";
import url from "url";
const __dirname = dirname(url.fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secret",
  password: "aezakni1212",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Home route
app.get("/", (req, res) => {
  res.sendFile(__dirname+"/public/index.html");
});

// Register user
app.post("/register.html", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const checkResult = await db.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2", 
      [username, email]
    );

    if (checkResult.rows.length > 0) {
      return res.sendFile(__dirname + "/public/register.html");
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );

    res.json({ 
      success: true, 
      message: "User registered successfully" 
    });

  } catch (err) {
    console.log(err);
    res.json({ 
      success: false, 
      message: "Registration failed" 
    });
  }
});

// Login user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1", 
      [username]
    );

    if (result.rows.length === 0) {
      return res.json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const user = result.rows[0];

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.json({ 
        success: true, 
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } else {
      res.json({ 
        success: false, 
        message: "Invalid password" 
      });
    }

  } catch (err) {
    console.log(err);
    res.json({ 
      success: false, 
      message: "Login failed" 
    });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
