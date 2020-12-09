import path from 'path';
import moment from 'moment';
import DiaryAnalyzer from './diary-analyzer';
import Crawler from './crawler';

enum Month {
  September = 9,
}

const accessToken = 'c575202ef269af8754c439302a9dc903da4d9e61';
const user = 'KiyonamiYu';
const repoName = 'daily-data';
const year = 2020;
const month = Month[9];
const fileName = '09-09-Wed.md';

const url = `https://api.github.com/repos/${user}/${repoName}/contents/${year}/${month}/${fileName}?access_token=${accessToken}`;
const filePath = path.resolve(__dirname, `../data/${year}/${month}.json`);
const analyzer = new DiaryAnalyzer(moment(`${year}-${fileName.substring(0, 5)}`, 'YYYY-MM-DD HH:mm:ss'));

const crawler = new Crawler(url, analyzer, filePath);