import {Component} from '@angular/core';

/**
 * @title Table with sticky header
 */
@Component({
  selector: 'app-delayed-transactions-list',
  templateUrl: './delayed-transactions-list.component.html',
  styleUrls: ['./delayed-transactions-list.component.css']
})
export class DelayedTransactionsListComponent {
  displayedColumns = ['position', 'transactionID', 'senderAccountNum', 'senderRoutingNum', 'receiverAccountNum', 'receiverRoutingNum', 'amount' ];
  dataSource = ELEMENT_DATA;
}

export interface DelayedTransactions {
  
  position: number;
  transactionID: string;
  senderAccountNum: string;
  senderRoutingNum: string;
  receiverAccountNum: string;
  receiverRoutingNum: string;
  amount: string;
}
//Sabreen Fix
const ELEMENT_DATA: DelayedTransactions[] = [
  {position: 1,  transactionID: 'transaction ID ', senderAccountNum: 'Sender Account Number', senderRoutingNum: 'Sender Routing Number', receiverAccountNum: 'receiver Account num', receiverRoutingNum: 'receiver routing', amount: 'amount'},
  {position: 2,  transactionID: 'transaction ID ', senderAccountNum: 'Sender Account Number', senderRoutingNum: 'Sender Routing Number', receiverAccountNum: 'receiver Account num', receiverRoutingNum: 'receiver routing', amount: 'amount'},
  {position: 3,  transactionID: 'transaction ID ', senderAccountNum: 'Sender Account Number', senderRoutingNum: 'Sender Routing Number', receiverAccountNum: 'receiver Account num', receiverRoutingNum: 'receiver routing', amount: 'amount'},
  {position: 4,  transactionID: 'transaction ID ', senderAccountNum: 'Sender Account Number', senderRoutingNum: 'Sender Routing Number', receiverAccountNum: 'receiver Account num', receiverRoutingNum: 'receiver routing', amount: 'amount'},
  {position: 5,  transactionID: 'transaction ID ', senderAccountNum: 'Sender Account Number', senderRoutingNum: 'Sender Routing Number', receiverAccountNum: 'receiver Account num', receiverRoutingNum: 'receiver routing', amount: 'amount'},
  {position: 6,  transactionID: 'transaction ID ', senderAccountNum: 'Sender Account Number', senderRoutingNum: 'Sender Routing Number', receiverAccountNum: 'receiver Account num', receiverRoutingNum: 'receiver routing', amount: 'amount'},
  {position: 7,  transactionID: 'transaction ID ', senderAccountNum: 'Sender Account Number', senderRoutingNum: 'Sender Routing Number', receiverAccountNum: 'receiver Account num', receiverRoutingNum: 'receiver routing', amount: 'amount'},
  {position: 8,  transactionID: 'transaction ID ', senderAccountNum: 'Sender Account Number', senderRoutingNum: 'Sender Routing Number', receiverAccountNum: 'receiver Account num', receiverRoutingNum: 'receiver routing', amount: 'amount'},
  {position: 9,  transactionID: 'transaction ID ', senderAccountNum: 'Sender Account Number', senderRoutingNum: 'Sender Routing Number', receiverAccountNum: 'receiver Account num', receiverRoutingNum: 'receiver routing', amount: 'amount'},
  {position: 10,  transactionID: 'transaction ID ', senderAccountNum: 'Sender Account Number', senderRoutingNum: 'Sender Routing Number', receiverAccountNum: 'receiver Account num', receiverRoutingNum: 'receiver routing', amount: 'amount'},
];