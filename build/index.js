"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var moment_1 = __importDefault(require("moment"));
var diary_analyzer_1 = __importDefault(require("./diary-analyzer"));
var crawler_1 = __importDefault(require("./crawler"));
var Month;
(function (Month) {
    Month[Month["September"] = 9] = "September";
})(Month || (Month = {}));
var accessToken = 'c575202ef269af8754c439302a9dc903da4d9e61';
var user = 'KiyonamiYu';
var repoName = 'daily-data';
var year = 2020;
var month = Month[9];
var fileName = '09-09-Wed.md';
var url = "https://api.github.com/repos/" + user + "/" + repoName + "/contents/" + year + "/" + month + "/" + fileName + "?access_token=" + accessToken;
var filePath = path_1.default.resolve(__dirname, "../data/" + year + "/" + month + ".json");
var analyzer = new diary_analyzer_1.default(moment_1.default(year + "-" + fileName.substring(0, 5), 'YYYY-MM-DD HH:mm:ss'));
var crawler = new crawler_1.default(url, analyzer, filePath);
