import { Injectable } from '@angular/core';
// import * as redis from 'redis';
// import { promisify } from 'util';
// import * as bluebird from 'bluebird';

@Injectable({
  providedIn: 'root'
})
export class RedisService {
  // client: redis.RedisClient;
  // redis: typeof redis;

  constructor() {
  }

  async startup() {
    // this.client = await this.redis.createClient({ db: 0 });
    // return this.client.keys('*');
  }
}
