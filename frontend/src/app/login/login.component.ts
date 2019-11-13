import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RedisService } from '../redis.service';
import { Observable } from "rxjs"
import {retry, catchError} from 'rxjs/operators'

export interface LoginResponse {
  isBank: boolean;
  verified: boolean;
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnChanges {
  @ViewChild('username') username;
  @ViewChild('password') password;
  constructor(
    private http: HttpClient,
    private api: RedisService
  ) { }

  async onSubmit() {
    console.log('clicked login')
    let req = {
      "username": this.username.nativeElement.value,
      "password": this.password.nativeElement.value
    }
    console.log(req)
    let response: Observable<LoginResponse> = this.http.post<LoginResponse>(
      `${this.api.apiUrlHttps}/login`,
      req,
      httpOptions
    )
    .pipe(
      retry(3),
    )
    console.log(response)
    response.subscribe(
      response => console.log(response)
    )
  }

  ngOnChanges() {
    console.log(Date.now())
  }

  ngOnInit() {
    console.log('initiate login');
  }

}
