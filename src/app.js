const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validation } = require("./utils/validation");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
//Middleware for coverting readable stream to Javascript object
app.use(express.json());
app.use(cookieParser());
//Get data from database based on email id
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  console.log("userEmail", userEmail);
  try {
    const users = await User.find({ email: userEmail });
    console.log("users", users);
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Get all data from database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//When user sign up
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    //  Validation
    validation(req);
    //  Encyption
    const passwordHash = await bcrypt.hash(password, 10);
    // creating user object
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    //  Save data in the database
    await user.save();
    res.send("Data Saved Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email", email, password);
    const user = await User.findOne({ email: email });
    console.log("user", user);
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    console.log("isPasswordValid", isPasswordValid);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("Login Successful!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong profile " + err.message);
  }
});
app.get("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;

  res.send(user.firstName + "'s Connection done");
});

connectDB()
  .then(() => {
    console.log("Connection Established successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000...");
    });
  })
  .catch((err) => {
    console.log("Connection failed");
  });
