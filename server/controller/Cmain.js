const { Job, Apply } = require("../models/");
const { User } = require("../models/");
const { Company } = require("../models/");
const { Op } = require("sequelize");

// create a new user
const post_user = async (req, res) => {
  const { name } = req.body;

  const result = await User.create({ user_name: name });

  res.json({ data: result });
};

module.exports = { post_user };
