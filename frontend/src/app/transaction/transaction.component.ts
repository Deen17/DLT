import {Component} from '@angular/core';

/**
 * @title Table with sticky header
 */
@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
})
export class TransactionComponent {
  displayedColumns = ['position', 'Transaction', 'Amount', 'currency'];
  dataSource = ELEMENT_DATA;
}

export interface PeriodicElement {
  Transaction: number;
  position: number;
  Amount: number;
  currency: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, Transaction: 1, Amount: 1.0079, currency: 'USD'},
  {position: 2, Transaction: 2, Amount: 4.0026, currency: '$'},
  {position: 3, Transaction: 3, Amount: 6.941, currency: '$'},
  {position: 4, Transaction: 5, Amount: 9.0122, currency: '$'},
  {position: 5, Transaction: 8, Amount: 10.811, currency: '$'},
  {position: 6, Transaction: 9, Amount: 12.0107, currency: '$'},
  {position: 7, Transaction: 10, Amount: 14.0067, currency: '$'},
  {position: 8, Transaction: 11, Amount: 15.9994, currency: '$'},
  {position: 9, Transaction: 13, Amount: 18.9984, currency: '$'},
  {position: 10,Transaction: 15, Amount: 20.1797, currency: '$'},
];
