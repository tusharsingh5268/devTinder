const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validation } = require("./utils/validation");
const app = express();
const bcrypt = require("bcrypt");
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
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  console.log("userId", userId);
  const data = req.body;

  try {
    const ALLOWED_UPDATE = ["photoUrl", "about", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) => {
      console.log("k", k);
      return ALLOWED_UPDATE.includes(k);
    });
    console.log("isUpdateAllowed", isUpdateAllowed);
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills should be less than 10");
    }
    await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("Updated Successfully");
  } catch (err) {
    res.status(400).send("Failed to save data" + " " + err.message);
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
