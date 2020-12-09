"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var js_base64_1 = require("js-base64");
var moment_1 = __importDefault(require("moment"));
var DiaryAnalyzer = /** @class */ (function () {
    function DiaryAnalyzer(date) {
        this.date = date;
    }
    DiaryAnalyzer.prototype.getDailyEvents = function (content) {
        var enterReplacedContent = content.replace(/\n/g, '');
        var decodedContent = js_base64_1.fromBase64(enterReplacedContent);
        var lines = decodedContent.split('\n').filter(function (line) { return line.length > 0; }); // 一行一行解析成 Diary
        var diary = {
            title: lines[0].substring(2),
            secondaryTitle: [],
            content: [],
        };
        for (var i = 1; i < lines.length; i++) {
            if (lines[i].startsWith('## ')) {
                diary.secondaryTitle.push(lines[i].substring(3));
            }
            else {
                var index_1 = diary.secondaryTitle.length - 1;
                if (diary.content[index_1] == null) {
                    diary.content[index_1] = [];
                }
                diary.content[index_1].push(lines[i]);
            }
        }
        // 解析日常内容，统计时常
        var dailyEventResult = {};
        var index = diary.secondaryTitle.indexOf('日常');
        var rawDailyEvents = diary.content[index];
        var startOClock = this.date;
        for (var _i = 0, rawDailyEvents_1 = rawDailyEvents; _i < rawDailyEvents_1.length; _i++) {
            var rawDailyEvent = rawDailyEvents_1[_i];
            var elements = rawDailyEvent.substring(2).split(' ');
            var endOClock = moment_1.default(startOClock.format('YYYY-MM-DD') + " " + elements[0], 'YYYY-MM-DD HH:mm');
            if (endOClock.isBefore(startOClock)) {
                // 下午增加 12 个小时
                endOClock.add(12, 'hours');
            }
            var type = elements[1];
            var duration = endOClock.diff(startOClock, 'hours', true);
            var detail = elements.slice(2).join(' ');
            var prevDailyEvent = dailyEventResult[type];
            if (prevDailyEvent == null) {
                dailyEventResult[type] = {
                    duration: duration,
                    detail: detail.length > 0 ? [detail] : [],
                };
            }
            else {
                dailyEventResult[type] = {
                    duration: prevDailyEvent.duration + duration,
                    detail: detail.length > 0 ? __spreadArrays(prevDailyEvent.detail, [detail]) : prevDailyEvent.detail,
                };
            }
            startOClock = endOClock;
        }
        return dailyEventResult;
    };
    DiaryAnalyzer.prototype.analyze = function (data, fileContent) {
        if (fileContent == null) {
            fileContent = [];
        }
        var content = data.content;
        var dailyEventResult = this.getDailyEvents(content);
        fileContent.push(dailyEventResult);
        return JSON.stringify(fileContent);
    };
    return DiaryAnalyzer;
}());
exports.default = DiaryAnalyzer;
