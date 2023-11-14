const { bcryptPassword, comparePassword } = require("./encryption");
const jwt = require("../utils/jwt_utils");
const { User } = require("../models");
// 회원가입
const postSignup = async (req, res) => {
  const { user_id, password } = req.body;

  //bcrypt 암호화
  const hashPw = bcryptPassword(password);

  const user = await User.create({
    user_id: user_id,
    password: hashPw,
  });

  res.json({
    result: true,
  });
};

// 로그인 result 1(user x) || 2(paasword x) || 3(succes)
const postSignin = async (req, res) => {
  const { user_id, password } = req.body;

  // 아이디 존재 여부 확인
  const user = await User.findOne({
    where: {
      user_id,
    },
  });

  if (user == null) {
    // 유저 없음
    res.send({ result: "1" });
  } else {
    if (comparePassword(password, user.password)) {
      // 로그인 성공 JWT토큰 생성
      const accessToken = jwt.sign(user);
      const refreshToken = await jwt.refresh(user.user_id);

      res.json({
        result: "3",
        data: {
          accessToken,
          refreshToken,
        },
      });
    } else {
      // 비밀번호 틀림
      res.send({ result: "2" });
    }
  }
};

const getUser = async (req, res) => {
  const { user_id, password } = req.body;

  const user = await User.findOne({
    where: {
      user_id,
    },
  });

  res.json({
    id: user.user_id,
    password: user.password,
  });
};

module.exports = { postSignin, postSignup, getUser };
