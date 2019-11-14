import { Component, OnInit, ViewChild} from '@angular/core';
import { ApiService } from '../api.service';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ApiService]
})
export class LoginComponent implements OnInit {
  @ViewChild('username') username;
  @ViewChild('password') password;
  buttonColor: ThemePalette = "primary"
  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  async onSubmit() {
    console.log('clicked login')
    let req = {
      "username": this.username.nativeElement.value,
      "password": this.password.nativeElement.value
    }
    if(!req.username || !req.password){
      this.buttonColor = "warn"
      alert('empty username or password')
    }
      
    let response = await this.api.login(req.username, req.password)
    console.log(response)
    if(!response.verified){
      this.buttonColor = 'warn'
      return;
    }
    this.buttonColor='primary'
    this.api.isBank = response.isBank
    this.api.loginSuccess.next(true)
    this.router.navigate(['account'])
  }

  ngOnInit() {
    console.log('initiate login');
  }

}
