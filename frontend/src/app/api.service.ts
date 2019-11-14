import { Injectable } from '@angular/core';
import { Observable } from "rxjs"
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AppModule } from './app.module';
import { retry } from 'rxjs/operators';

export interface LoginResponse {
  isBank: boolean;
  verified: boolean;
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: string = '35.243.204.5'
  httpUrl: string;
  httpsUrl: string;
  constructor(
    private http: HttpClient
  ) {
    this.httpsUrl = `https://${this.url}`
    this.httpUrl = `http://${this.url}:81`
  }

  login(username: string, password: string): Promise<LoginResponse> {
    let response = this.http.post<LoginResponse>(
      `${this.httpsUrl}/login`,
      { 
        'username': username,
        'password': password
      },
      httpOptions
    )
    .pipe(
      retry(3)
    )

    return response.toPromise()
  }
}
