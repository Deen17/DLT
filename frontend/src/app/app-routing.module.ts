import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { UserListComponent } from './user-list/user-list.component';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'account', component: AccountComponent },
  { path: 'users', component: UserListComponent },
  { path: 'createtransaction', component: CreateTransactionComponent },
  { path: 'transactions', component: TransactionListComponent, data: {delayed: false} },
  { path: 'delayed', component: TransactionListComponent, data: {delayed : true}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
