import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

import { LoginComponent } from './login/login.component';
import { BankComponent } from './bank/bank.component';
import { UserListComponent } from './user-list/user-list.component';
import { AccountComponent } from './account/account.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';

import {MatTableModule} from '@angular/material/table';

import {HttpClientModule} from '@angular/common/http';
//import {Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



//import {merge, Observable, of as observableOf} from 'rxjs';
//import {catchError, map, startWith, switchMap} from 'rxjs/operators';

//import {TableExpandableRowsExample} from './transaction-list/transaction-list.component';
//test

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BankComponent,
    UserListComponent,
    AccountComponent,
    TransactionListComponent,
    CreateTransactionComponent, 
      
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule, 
    HttpClientModule,
    MatTableModule, 
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
