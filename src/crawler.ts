import fs from 'fs';
import axios from 'axios';

export interface Analyzer {
  analyze: (data: any, fileContent: any) => string;
}

// TODO：按照之前定义自己的格式，只解析 h1、h2 为止（先按简单的来）

export default class Crawler {
  constructor(private url: string, private analyzer: Analyzer, private filePath: string) {
    this.initSpiderProcess();
  }

  private async getRawData(): Promise<any> {
    const { data } =  await axios.get(this.url);
    return data;
  }

  private getFileContent(): any {
    if (!fs.existsSync(this.filePath)) {
      return null;
    }

    return JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
  }

  private writeFile(content: string): void {
    fs.writeFileSync(this.filePath, content);
  }

  private async initSpiderProcess() {
    const rawData: any = await this.getRawData(); // 获取原始日记
    const fileContent: any = await this.getFileContent(); // 获取原来的统计结果（用于累加）
    const result: string = this.analyzer.analyze(rawData, fileContent); // 分析文件，当天计算的结果累加至末尾
    this.writeFile(result); // 写入对应文件
  }
}
