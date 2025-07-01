const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  validatePasswordEditProfileData,
  validateCurrentPasswordCorrect,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong profile " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validatePasswordEditProfileData(req.body)) {
      throw new Error("Invalid Field given for change!!");
    }
    const loggedUser = req.user;
    Object.keys(req.body).forEach((key) => {
      return (loggedUser[key] = req.body[key]);
    });

    await loggedUser.save();
    res.json({
      message: "Your profile is updated successful",
      updatedUser: loggedUser,
    });
  } catch (err) {
    res.status(400).send("Something went wrong profile " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    console.log(
      "validateCurrentPasswordCorrect(req.body, loggedUser)",
      await validateCurrentPasswordCorrect(req.body, loggedUser)
    );
    if (!(await validateCurrentPasswordCorrect(req.body, loggedUser))) {
      throw new Error("Current password is wrong!!");
    }
    const newPassword = req.body?.newPassword;
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    console.log("newPasswordHash", newPasswordHash);
    loggedUser.password = newPasswordHash;
    await loggedUser.save();
    console.log("newPasswordLoggedUser", loggedUser);
    res.send("Password is changed successfully!!");
  } catch (err) {
    res.status(400).send("Something went wrong profile " + err.message);
  }
});

module.exports = profileRouter;
