import { Injectable } from '@angular/core';
import { Observable } from "rxjs"

export interface LoginResponse {
  isBank: boolean;
  verified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: string = '35.243.204.5'
  httpUrl: string;
  httpsUrl: string;
  constructor() {
    this.httpsUrl = `https://${this.url}`
    this.httpUrl = `http://${this.url}:81`
   }

   async login(): Observable<LoginResponse> {

   }
}
