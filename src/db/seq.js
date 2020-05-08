const Sequelize = require("sequelize");

const conf = {
  host: "192.168.147.128",
  dialect: "mysql",
};

// 线上环境，使用连接池
// conf.pool = {
//   max: 5,
//   min: 0,
//   idle: 1000
// }

const seq = new Sequelize("root", "root", "root", conf);

module.exports = seq;
