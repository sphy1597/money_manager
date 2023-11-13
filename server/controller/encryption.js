require("dotenv").config();

const bcrypt = require("bcrypt");

const saltNumber = process.env.SALT_NUM;

// 암호화
const bcryptPassword = (_password) => {
  return bcrypt.hashSync(_password, saltNumber);
};

//비교
const comparePassword = (password, dbPassword) => {
  return bcrypt.compareSync(password, dbPassword);
};

module.exports = { bcryptPassword, comparePassword };
