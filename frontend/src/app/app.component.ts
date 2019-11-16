import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

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
  ) {
    this.api.login$.subscribe(
      result => {
        this.setLoginStatus(result)
      }
    )
  }

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


  }
}
