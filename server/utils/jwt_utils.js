require("dotenv").config();
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const redisClient = require("./redis");
const { decode } = require("punycode");
const secret = process.env.SECRET;

// accesstoken 생성
const sign = (_user) => {
  const payload = {
    user_id: _user.user_id,
  };

  const accessToken = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
  return accessToken;
};
// accessToken 검증
const verify = async (token) => {
  let decoded = null;
  try {
    decoded = jwt.verify(token, secret);
    const result = {
      result: true,
      user_id: decoded.user_id,
    };
    return result;
  } catch (err) {
    return {
      result: false,
      message: err.message,
    };
  }
};

// refresh token 발급
const refresh = (_user_id) => {
  const newrefreshToken = jwt.sign({}, secret, {
    // refresh token은 payload 없이 발급
    algorithm: "HS256",
    expiresIn: "14d",
  });

  redisClient.set(_user_id, newrefreshToken);

  return newrefreshToken;
};

// refresh token 검증
const refreshVerify = async (_token, _user_id) => {
  /* redis 모듈은 기본적으로 promise를 반환하지 않으므로,
       promisify를 이용하여 promise를 반환하게 해줍니다.*/
  const getAsync = promisify(redisClient.get).bind(redisClient);
  try {
    const data = await getAsync(_user_id);
    if (_token == data) {
      try {
        jwt.verify(token, secret);
        return true;
      } catch (err) {
        return false;
      }
    }
  } catch (err) {
    return false;
  }
};

module.exports = { sign, verify, refresh, refreshVerify };
