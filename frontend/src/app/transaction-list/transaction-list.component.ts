import {Component} from '@angular/core';

/**
 * @title Table with sticky header
 */
@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
@Component({
  selector: 'paginator-overview-example',
  templateUrl: 'paginator-overview-example.html',
  styleUrls: ['paginator-overview-example.css'],
})
export class TransactionListComponent {
  displayedColumns = ['position', 'lastName', 'firstName', 'amount'];
  dataSource = ELEMENT_DATA;
}

export interface PeriodicElement {
  lastName: string;
  position: number;
  firstName: string;
  amount: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, lastName: 'Last Name', firstName: 'First Name', amount: 'Acct#'},
  {position: 2, lastName: 'Last Name', firstName: 'First Name', amount: 'Acct#'},
  {position: 3, lastName: 'Last Name', firstName: 'First Name', amount: 'Acct#'},
  {position: 4, lastName: 'Last Name', firstName: 'First Name', amount: 'Acct#'},
  {position: 5, lastName: 'Last Name', firstName: 'First Name', amount: 'Acct#'},
  {position: 6, lastName: 'Last Name', firstName: 'First Name', amount: 'Acct#'},
  {position: 7, lastName: 'Last Name', firstName: 'First Name', amount: 'Acct#'},
  {position: 8, lastName: 'Last Name', firstName: 'First Name', amount: 'Acct#'},
  {position: 9, lastName: 'Last Name', firstName: 'First Name', amount: 'Acct#'},
  {position: 10, lastName: 'Last Name', firstName: 'First Name', amount: 'Acct#'},
];