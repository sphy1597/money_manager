const { bcryptPassword, comparePassword } = require("./encryption");
const jwt = require("../utils/jwt_utils");
const redisClient = require("../utils/redis");
const { User } = require("../models");
// 회원가입
const post_signup = async (req, res) => {
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
const post_signin = async (req, res) => {
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
      const refreshToken = jwt.refresh();

      redisClient.set(user_id, refreshToken);

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

module.exports = { post_signin, post_signup };
