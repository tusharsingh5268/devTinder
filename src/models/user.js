const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please give correct email address");
        }
      },
    },
    password: {
      type: String,
    },
    age: {
      type: String,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          console.log("inside if");
          throw new Error("Gender is not correct");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://weimaracademy.org/wp-content/uploads/2021/08/dummy-user.png",
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      default: "This is the default information about user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
