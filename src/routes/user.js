const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
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

module.exports = userRouter;
