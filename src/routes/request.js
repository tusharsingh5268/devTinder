const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();
const User = require("../models/user");
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "User not found!!",
        });
      }

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid Status Type " + status });
      }

      //If there is already request is sent
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection Request Already Exists!!",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: "Connection Request sent successfuly!!",
        data,
      });
    } catch (err) {
      res.status(404).send("Error " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(404).json({ message: "Status not found" });
      }
      console.log(
        "status",
        status,
        requestId,
        "requestId",
        "toUserId",
        loggedUser._id
      );
      const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).send("Connection Request not found!!");
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({
        message: "Connection Request " + status,
        data,
      });

      console.log("connectionRequest", connectionRequest);
    } catch (err) {
      res.status(404).send("Error " + err);
    }
  }
);

module.exports = requestRouter;
