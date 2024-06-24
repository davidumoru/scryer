const userServices = require("../services/user.services");

const signup = async (req, res) => {
  try {
    const data = await userServices.signup(req.body);
    res.status(data.statusCode).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const data = await userServices.login(req.body);
    res.status(data.statusCode).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login };
