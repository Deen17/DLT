import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  isLoggedIn = false;
  isBank = false;

  constructor(
    private router: Router,
    private api: ApiService
  ) {}

  setLoginStatus(loggedIn: boolean) {
    this.isLoggedIn = loggedIn;
    this.isBank = this.api.isBank;
    console.log('set login status:', this.isLoggedIn, this.isBank)
  }

  async ngOnInit() {
    console.log('start app component');
    if (!this.isLoggedIn) {
      this.router.navigate(['login']);
    }
    else if (this.isBank) {
      this.router.navigate(['bank']);
    }

    this.api.loginSuccess.subscribe(
      result => {
        console.log('result', result)
        this.setLoginStatus(result)
      }
    )

    this.api.loginSuccess.next(false)
  }
}
