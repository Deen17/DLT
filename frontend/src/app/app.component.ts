import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { RedisService } from './redis.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  isLoggedIn = false;
  isBank = true;

  constructor(
    private router: Router,
    private redis: RedisService
  ) { }

  async ngOnInit() {
    console.log('start app component');
    console.log(await this.redis.startup);
    if (!this.isLoggedIn) {
      this.router.navigate(['login']);
    }
  }
}
