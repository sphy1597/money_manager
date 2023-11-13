'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  
  config
);

db.Job = require('./Job')(sequelize);
db.User = require('./User')(sequelize);
db.Company = require('./Company')(sequelize);
db.Apply = require('./Apply')(sequelize);

// 외래키 관계 설정
db.Company.hasMany(db.Job, {foreignKey: 'company_id'});
db.Job.belongsTo(db.Company, {foreignKey: 'company_id'});

db.Job.hasMany(db.Apply, {foreignKey: 'Job_id'});
db.Apply.belongsTo(db.Job, {foreignKey: 'Job_id'});

db.User.hasMany(db.Apply, {foreignKey: 'id'});
db.Apply.belongsTo(db.User, {foreignKey: 'id'});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
