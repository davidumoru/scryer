const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.models");
const response = require("../utils/response");

const signup = async (payload) => {
  try {
    const { firstName, lastName, email, password } = payload;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.buildFailureResponse("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    return response.buildSuccessResponse("User created successfully", 201, {
      token,
    });
  } catch (error) {
    console.error(error);
    return response.buildFailureResponse("Internal Server Error", 500);
  }
};

const login = async (payload) => {
  try {
    const { email, password } = payload;

    const user = await User.findOne({ email });
    if (!user) {
      return response.buildFailureResponse("User not found", 400);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return response.buildFailureResponse("Invalid Password", 403);
    }

    const token = jwt.sign(
      { userId: User._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    return response.buildSuccessResponse("Login Successful", 200, { token });
  } catch (error) {
    console.error(error);
    return response.buildFailureResponse("Internal Server Error", 500);
  }
};

module.exports = { signup, login };
