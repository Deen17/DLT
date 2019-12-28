import { Injectable } from '@angular/core';
import { Observable, throwError, Subject } from "rxjs"
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { retry, catchError } from 'rxjs/operators';
import { TransactionResponse, Transaction, transactionRow, convertResponseToTransaction } from './transaction'

export interface LoginResponse {
  isBank: boolean;
  verified: boolean;
  accNum: string;
  routingNum: string;
}

export interface TransactionListResponse {
  transactions: string[];
}

export interface TransactionProcessingResponse {
  response: string;
}

export interface AccountResponse {
  name: string;
  balance: number;
}

export interface TransactionCountResponse {
  count: number;
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
  amt: number;
  instrument: string;
  constructor(
    receiverAcctNum: string,
    receiverRoutingNum: string,
    amt: number,
    instrument: string
  ) {
    this.receiverAcctNum = receiverAcctNum,
      this.amt = amt,
      this.receiverRoutingNum = receiverRoutingNum,
      this.instrument = instrument
  }

  toTransactionRequest(senderAcctNum: string, senderRoutingNum: string): TransactionRequest {
    return {
      amt: this.amt,
      initial_amt: this.amt,
      receiverAcctNum: this.receiverAcctNum,
      receiverRoutingNum: this.receiverRoutingNum,
      currency: 'USD',
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
  public fullID: string;

  public loginSuccess: Subject<boolean>;
  public login$: Observable<boolean>;

  constructor(
    private http: HttpClient
  ) {
    this.httpsUrl = `https://${this.url}`
    this.httpUrl = `http://${this.url}:81`
    this.loginSuccess = new Subject<boolean>()
    this.login$ = this.loginSuccess.asObservable()
    console.log('service initiated')
  }

  public loginObservable(): Observable<boolean> {
    return this.loginSuccess.asObservable();
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

  getTransactionDetailsByID(id: string): Promise<TransactionResponse> {
    let response = this.http.get<TransactionResponse>(
      `${this.httpsUrl}/transaction/${id}`,
      httpOptions
    )
      .pipe(
        retry(3),
        catchError(this.handleError)
      )

    return response.toPromise()
  }

  getDelayedTransactionDetailsByID(id: string): Promise<TransactionResponse> {
    let response = this.http.get<TransactionResponse>(
      `${this.httpsUrl}/delayedtx/${id}`,
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

  getTransactionCountByID(id: string): Promise<TransactionCountResponse> {
    let response = this.http.get<TransactionCountResponse>(
      `${this.httpsUrl}/users/${id}/transactioncount`,
      httpOptions
    )
      .pipe(
        retry(3),
        catchError(this.handleError)
      )

    return response.toPromise();
  }

  getDelayedTransactionCountByBankID(id: string): Promise<TransactionCountResponse> {
    let response = this.http.get<TransactionCountResponse>(
      `${this.httpsUrl}/banks/${id}/delayedcount`,
      httpOptions
    )
      .pipe(
        retry(3),
        catchError(this.handleError)
      )

    return response.toPromise();
  }

  getDelayedTransactionsByBankID(
    id: string): Promise<TransactionListResponse> {
    let response = this.http.get<TransactionListResponse>(
      `${this.httpsUrl}/banks/${id}/delayedtransactions`,
      httpOptions
    )
      .pipe(
        retry(3),
        catchError(this.handleError)
      )
    return response.toPromise();

  }

  getTransactionsByUserID(
    id: string): Promise<TransactionListResponse> {
    let response = this.http.get<TransactionListResponse>(
      `${this.httpsUrl}/users/${id}/transactions`,
      httpOptions
    )
      .pipe(
        retry(3),
        catchError(this.handleError)
      )
    return response.toPromise();

  }

  getTransactionsByStart(
    id: string,
    start: number): Promise<TransactionListResponse> {
    let response = this.http.get<TransactionListResponse>(
      `${this.httpsUrl}/users/${id}/transactions/${start}`,
      httpOptions
    )
      .pipe(
        retry(3),
        catchError(this.handleError)
      )
    return response.toPromise();
  }

  getTransactionsByStartEnd(
    id: string,
    start: number,
    end: number
  ): Promise<TransactionListResponse> {
    let response = this.http.get<TransactionListResponse>(
      `${this.httpsUrl}/users/${id}/transactions/${start}/${end}`,
      httpOptions
    )
      .pipe(
        retry(3),
        catchError(this.handleError)
      )
    return response.toPromise();
  }

  getDelayedTransactionsByStartEnd(
    id: string,
    start: number,
    end: number
  ): Promise<TransactionListResponse> {
    let response = this.http.get<TransactionListResponse>(
      `${this.httpsUrl}/banks/${id}/delayedtransactions/${start}/${end}`,
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
  postTransaction(transaction: TransactionRequest): Promise<TransactionProcessingResponse> {
    let response = this.http.post<TransactionProcessingResponse>(
      `${this.httpsUrl}/users/transact`,
      transaction,
      httpOptions
    )
      .pipe(
        //retry(3),
        catchError(this.handleError)
      )
    return response.toPromise();
  }

    /**
   * Post a Transaction.
   * @param {}
   */
  postUnsafeTransaction(transaction: TransactionRequest): Promise<TransactionProcessingResponse> {
    let response = this.http.post<TransactionProcessingResponse>(
      `${this.httpUrl}/users/transact`,
      transaction,
      httpOptions
    )
      .pipe(
        //retry(3),
        catchError(this.handleError)
      )
    return response.toPromise();
  }

  postUndelay(transaction: transactionRow): Promise<TransactionProcessingResponse> {
    let response = this.http.post<TransactionProcessingResponse>(
      `${this.httpsUrl}/banks/acceptDelay`,
      {
        'transactionID': transaction.transactionID,
        'senderAcctNum': transaction.senderAccNum,
        'senderRoutingNum': transaction.senderRoutingNum,
        'receiverAcctNum': transaction.receiverAccNum,
        'receiverRoutingNum': transaction.receiverRoutingNum,
        'initial_amt': +transaction.initial_amt,
        'amt': +transaction.amt,
        'currency': transaction.currency,
        'instrument': transaction.instrument,
        'settled': transaction.settled, //POSSIBLY PROBLEMATIC
        'mutations': transaction.mutations
      },
      httpOptions
    )
    .pipe(
      catchError(this.handleError)
    )

    return response.toPromise()
  }
}


