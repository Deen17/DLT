import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  ) { }

  async ngOnInit() {
    console.log('start app component');
    if (!this.isLoggedIn) {
      this.router.navigate(['login']);
    }
    else if(this.isBank){
      this.router.navigate(['bank']);
    }
  }
}
