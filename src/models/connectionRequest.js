const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    status: {
      type: String,
      require: true,

      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{Value} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre("save", function () {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself!!");
  }
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
