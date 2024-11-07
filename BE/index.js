const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const User = require("./models/User");
const Msg = require("./models/Msg");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const ws = require("ws");

mongoose.connect(process.env.DB_URL);
const jwtSecret = process.env.JWT_SECRET;

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;

    if (!token) {
      return reject(new Error("No token provided")); // Reject if no token
    }

    jwt.verify(token, jwtSecret, (err, userData) => {
      if (err) {
        return reject(err); // Reject with error if verification fails
      }
      resolve(userData); // Resolve with userData if successful
    });
  });
}

app.get("/", (req, res) => {
  res.send("ChatApp server running - codewithkara");
});

app.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const userData = await getUserDataFromRequest(req);
    const ourUserId = userData.userId;

    const messages = await Msg.find({
      sender: { $in: [userId, ourUserId] },
      recipient: { $in: [userId, ourUserId] },
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
});

app.get("/people", async (req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 });
  res.json(users);
});

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, { expiresIn: "5h" }, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(401).json({
        message: "Credentials Incorrect! Try Again.",
      });
    }

    // Compare the hashed password
    const isPasswordCorrect = bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Credentials Incorrect! Try Again.",
      });
    }

    // Sign a JWT token for the logged-in user
    jwt.sign(
      { userId: existingUser._id, username },
      jwtSecret,
      { expiresIn: "5h" }, // Uncomment if you want token expiration
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Failed to generate token",
          });
        }

        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(200)
          .json({
            message: "User Logged In Successfully!",
            id: existingUser._id,
          });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username }); // Use findOne to get a single user

    if (existingUser) {
      return res.status(409).json({
        message: "Username Already Exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create the new user
    const createdUser = await User.create({
      username,
      password: hashedPassword, // Save the hashed password
    });

    // Sign a JWT token for the created user
    jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      { expiresIn: "5h" }, // Set an expiration for the token
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Failed to generate token",
          });
        }
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            message: "User Registered Successfully!",
            id: createdUser._id,
          });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

const server = app.listen(3000);

const wss = new ws.WebSocketServer({ server });

wss.on("connection", (connection, req) => {
  //read username and id from the cookie for this connection
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          (connection.userId = userId), (connection.username = username);
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text } = messageData;
    if (recipient && text) {
      const messageDoc = await Msg.create({
        sender: connection.userId,
        recipient,
        text,
      });
      [...wss.clients]
        .filter((c) => c.userId === recipient)
        .forEach((c) =>
          c.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient,
              _id: messageDoc._id,
            })
          )
        );
    }
  });

  //notify everyone about online people (when someone connected)
  [...wss.clients].forEach((client) => {
    client.send(
      JSON.stringify({
        online: [...wss.clients].map((c) => ({
          userId: c.userId,
          username: c.username,
        })),
      })
    );
  });
});
