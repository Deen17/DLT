import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {BankComponent} from './bank/bank.component'

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'bank', component: BankComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
