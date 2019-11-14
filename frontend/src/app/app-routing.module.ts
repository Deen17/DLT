import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {BankComponent} from './bank/bank.component'
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'bank', component: BankComponent},
  {path: 'account', component: AccountComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
