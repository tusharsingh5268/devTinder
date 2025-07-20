const express = require("express");
const { validation } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

//When user sign up
authRouter.post("/signup", async (req, res) => {
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
    const savedUser = await user.save();
    const token = await user.getJWT();
    res.cookie("token", token);
    res.json({ message: "Data Saved Successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    console.log("isPasswordValid", isPasswordValid);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
});

module.exports = authRouter;
