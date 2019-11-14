import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs"
import {retry, catchError} from 'rxjs/operators'
import { ApiService } from '../api.service';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ApiService]
})
export class LoginComponent implements OnInit, OnChanges {
  @ViewChild('username') username;
  @ViewChild('password') password;
  buttonColor: ThemePalette = "primary"
  constructor(
    private http: HttpClient,
    private api: ApiService
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
    this.buttonColor='primary'
  }

  ngOnChanges() {
    console.log(Date.now())
  }

  ngOnInit() {
    console.log('initiate login');
  }

}
