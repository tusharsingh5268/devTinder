const validator = require("validator");
const bcrypt = require("bcrypt");

const validation = (req) => {
  const { firstName, lastName, email } = req.body;
  console.log("firstName", firstName);
  if (!firstName || !lastName) {
    throw new Error("Please give full name!");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not correct!");
  }
};

const validatePasswordEditProfileData = (req) => {
  console.log("req", req);
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "about",
    "skills",
    "gender",
    "photoUrl",
  ];
  const isEditAllowed = Object.keys(req).every((field) => {
    return allowedEditFields.includes(field);
  });
  return isEditAllowed;
};

const validateCurrentPasswordCorrect = async (req, user) => {
  const { currentPassword } = req;
  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password
  );
  return isCurrentPasswordValid;
};

module.exports = {
  validation,
  validatePasswordEditProfileData,
  validateCurrentPasswordCorrect,
};
