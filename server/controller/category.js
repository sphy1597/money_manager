// 카테고리 가져오기
const getCategory = async (req, res) => {
  res.json({
    message: "식비, 교통비, 카페, 쇼핑, 생필품, 미용, 기타",
  });
};

module.exports = { getCategory };
