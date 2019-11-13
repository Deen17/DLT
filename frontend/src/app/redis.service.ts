import { Injectable } from '@angular/core';
// import * as redis from 'redis';
// import { promisify } from 'util';
// import * as bluebird from 'bluebird';

@Injectable({
  providedIn: 'root'
})
export class RedisService {
  apiUrlHttps = 'https://localhost:8443'
  apiUrlHttp = 'http://localhost:8080'
  constructor() {
  }

  async startup() {
    // this.client = await this.redis.createClient({ db: 0 });
    // return this.client.keys('*');
  }
}
