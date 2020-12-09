import { fromBase64 } from 'js-base64';
import moment from 'moment';

import { Analyzer } from './crawler';

interface Diary {
  title: string;
  secondaryTitle: string[];
  content: string[][]; // 每个 h2 对应 string[]
}

interface DailyEventResult {
  [type: string]: {
    duration: number;
    detail: string[];
  }
}

export default class DiaryAnalyzer implements Analyzer {
  constructor(private date: moment.Moment) {
  }

  private getDailyEvents(content: string): DailyEventResult {
    const enterReplacedContent = content.replace(/\n/g, '');
    const decodedContent = fromBase64(enterReplacedContent);
    const lines = decodedContent.split('\n').filter(line => line.length > 0); // 一行一行解析成 Diary

    let diary: Diary = {
      title: lines[0].substring(2), // h1
      secondaryTitle: [],
      content: [],
    };

    for (let i = 1; i < lines.length; i ++) {
      if (lines[i].startsWith('## ')) {
        diary.secondaryTitle.push(lines[i].substring(3));
      } else {
        const index = diary.secondaryTitle.length - 1;
        if (diary.content[index] == null) {
          diary.content[index] = [];
        }
        diary.content[index].push(lines[i]);
      }
    }

    // 解析日常内容，统计时常
    const dailyEventResult: DailyEventResult = {};
    const index = diary.secondaryTitle.indexOf('日常');
    const rawDailyEvents = diary.content[index];
    let startOClock: moment.Moment = this.date;
    for(const rawDailyEvent of rawDailyEvents) {
      const elements = rawDailyEvent.substring(2).split(' ');
      const endOClock = moment(
        `${startOClock.format('YYYY-MM-DD')} ${elements[0]}`,
        'YYYY-MM-DD HH:mm'
      );
      if (endOClock.isBefore(startOClock)) {
        // 下午增加 12 个小时
        endOClock.add(12, 'hours');
      }
      const type = elements[1];
      const duration = endOClock.diff(startOClock, 'hours', true);
      const detail = elements.slice(2).join(' ');
      const prevDailyEvent = dailyEventResult[type];
      if (prevDailyEvent == null) {
        dailyEventResult[type] = {
          duration,
          detail: detail.length > 0 ? [detail] : [],
        }
      } else {
        dailyEventResult[type] = {
          duration: prevDailyEvent.duration + duration,
          detail: detail.length > 0 ? [...prevDailyEvent.detail, detail] : prevDailyEvent.detail,
        }
      }
      startOClock = endOClock;
    }

    return dailyEventResult;
  }

  analyze(data: { content: string }, fileContent: DailyEventResult[] | null) {
    if (fileContent == null) {
      fileContent = [];
    }
    const { content } = data;
    const dailyEventResult: DailyEventResult = this.getDailyEvents(content);
    fileContent.push(dailyEventResult);
    return JSON.stringify(fileContent);
  }

}