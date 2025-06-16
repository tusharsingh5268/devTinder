const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

//Middleware for coverting readable stream to Javascript object
app.use(express.json());

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

//When user login
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("Data Saved Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Delete the user by user id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    console.log("Deleted user id");
    await User.findByIdAndDelete(userId);
    res.send("Successfully deleted the User");
  } catch (err) {
    res.status(400).send("Failed to save data");
  }
});

//Update the user by user id
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    await User.findByIdAndUpdate(userId, data);
    res.send("Updated Successfully");
  } catch (err) {
    res.status(400).send("Failed to save data");
  }
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
