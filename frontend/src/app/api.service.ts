import { Injectable } from '@angular/core';
import { Observable, throwError, Subject } from "rxjs"
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { retry, catchError } from 'rxjs/operators';
import { promisify } from 'util';

export interface LoginResponse {
  isBank: boolean;
  verified: boolean;
}

export interface AccountResponse {
  name: string;
  balance: number;
}

export interface TransactionRequest {
  senderAcctNum: string,
  receiverAcctNum: string,
  senderRoutingNum: string,
  receiverRoutingNum: string,
  currency: string,
  initial_amt: number,
  amt: number,
  instrument: string,
  settled: boolean,
  mutations: string[]
}

export class TransactionForm {
  receiverAcctNum: string;
  receiverRoutingNum: string;
  currency: string;
  amt: number;
  instrument: string;
  constructor(
    receiverAcctNum: string,
    receiverRoutingNum: string,
    currency: string,
    amt: number,
    instrument: string
  ){
    this.receiverAcctNum = receiverAcctNum,
    this.amt = amt,
    this.receiverRoutingNum = receiverRoutingNum,
    this.currency = currency,
    this.instrument = instrument
  }

  toTransactionRequest(senderAcctNum: string, senderRoutingNum: string): TransactionRequest {
    return {
      amt: this.amt,
      initial_amt: this.amt,
      receiverAcctNum: this.receiverAcctNum,
      receiverRoutingNum: this.receiverAcctNum,
      currency: this.currency,
      instrument: this.instrument,
      mutations: [],
      senderAcctNum: senderAcctNum,
      senderRoutingNum: senderRoutingNum,
      settled: false
    }
  }
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: string = '35.243.204.5'
  httpUrl: string;
  httpsUrl: string;

  public accNum: string;
  public routingNum: string;
  public username: string;
  public isBank: boolean;

  loginSuccess: Subject<boolean> = new Subject<true>()
  login$: Observable<boolean> = this.loginSuccess.asObservable()

  constructor(
    private http: HttpClient
  ) {
    this.httpsUrl = `https://${this.url}`
    this.httpUrl = `http://${this.url}:81`
  }

  //straight from angular.io
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

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
        retry(3),
        catchError(this.handleError)
      )

    return response.toPromise()
  }

  getUserDetailsByID(id: string): Promise<AccountResponse> {
    let response = this.http.get<AccountResponse>(
      `${this.httpsUrl}/users/${id}`,
      httpOptions
    )
      .pipe(
        retry(3),
        catchError(this.handleError)
      )

    return response.toPromise()
  }

  getUsersByBankID(id: string): Promise<string[]> {
    let response = this.http.get<string[]>(
      `${this.httpsUrl}/banks/${id}/users`,
      httpOptions
    )
      .pipe(
        retry(3),
        catchError(this.handleError)
      )

    return response.toPromise();
  }

  /**
   * Post a Transaction.
   * @param {}
   */
  postTransaction(transaction: TransactionRequest): Promise<number>
  {
    let response = this.http.post<number>(
      `${this.httpsUrl}/users/transact`,
      transaction,
      httpOptions
    )
    .pipe(
      retry(3),
      catchError(this.handleError)
    )
    return response.toPromise();
  }


}
