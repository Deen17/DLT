import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule, HttpClient} from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule, MatSort} from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { LoginComponent } from './login/login.component';
import { BankComponent } from './bank/bank.component';
import { UserListComponent } from './user-list/user-list.component';
import { AccountComponent } from './account/account.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import {MatDialogModule} from '@angular/material/dialog';
import { TransactionComponent } from './transaction/transaction.component';
import { DelayedTransactionsListComponent } from './delayed-transactions-list/delayed-transactions-list.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BankComponent,
    UserListComponent,
    AccountComponent,
    TransactionListComponent,
    CreateTransactionComponent,
    TransactionComponent,
    DelayedTransactionsListComponent,
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
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSortModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
