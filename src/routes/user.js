const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName skills about photoUrl age gender";
//Getting all pending request
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedUSer = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedUSer._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.json({
      message: "Data fetched succesfully!!",
      data: connectionRequest,
    });
  } catch (err) {
    res.send(404).send("Error " + err);
  }
});

//Getting accepted request
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.send({ data });
  } catch (err) {
    res.send(404).send("Error " + err);
  }
});
//Gettitng all users without loggedInuser and connection with loggedInUser
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    let limit = req.query.limit;
    const page = req.query.page;
    const skip = (page - 1) * limit;
    limit = limit > 50 ? 50 : limit;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
        },
        {
          fromUserId: loggedInUser._id,
        },
      ],
    }).select("toUserId fromUserId");

    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString()),
        hideUserFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideUserFromFeed) },
        },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: "Error " + err });
  }
});

module.exports = userRouter;
