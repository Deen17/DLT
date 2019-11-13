import { Injectable } from '@angular/core';
// import * as redis from 'redis';
// import { promisify } from 'util';
// import * as bluebird from 'bluebird';

@Injectable({
  providedIn: 'root'
})
export class RedisService {
  apiUrlHttps = 'https://35.237.55.104:443'
  apiUrlHttp = 'http://35.237.55.104:81'
  constructor() {
  }

  async startup() {
    // this.client = await this.redis.createClient({ db: 0 });
    // return this.client.keys('*');
  }
}
