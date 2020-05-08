/**
 * @description 存储配置
 * @author KiyonamiYu
 */

const { isProd } = require("../utls/env");

let REDIS_CONF = {
  port: 6379,
  host: "192.168.147.128",
};

if (isProd) {
  // 线上环境
  REDIS_CONF = {
    port: 6379,
    host: "192.168.147.128",
  };
}

module.exports = {
  REDIS_CONF,
};
