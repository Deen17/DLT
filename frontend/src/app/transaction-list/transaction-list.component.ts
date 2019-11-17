import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { convertResponseToTransaction, TransactionResponse, Transaction, transactionRow } from '../transaction';
import {MatTableDataSource, MatTable} from '@angular/material/table'
import {MatPaginator} from '@angular/material/paginator';

/**
 * @name TransactionListComponent
 * @description Displays a table of transactions. Clicking a transactionID
 * allows one to peruse the details of that specific transaction. The table
 * itself only shows Transaction ID
 * 
 */
@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  transactionCount: number;
  transactionIDs: string[];
  //transactionRows = new MatTableDataSource<transactionRow>([]);
  transactionData: transactionRow[] = [];
  transactionColumns = ['transactionID','senderAccNum'];
  transactionJSONArray = [];
  constructor(
    private api: ApiService
  ) {

  }

  async ngOnInit() {
    this.transactionCount =
      await this.api.getTransactionCountByID(this.api.fullID)
    console.log('transactioncount: ', this.transactionCount)

    let response = await
      this
        .api
        .getTransactionsByStartEnd(
          this.api.fullID,
          0,
          10
        )
    this.transactionIDs = response.transactions
    console.log(this.transactionIDs)

    await this.fetchTransactionData()
  }

  onClick(transaction){
    console.log(transaction)
  }

  async fetchTransactionData() {
    this.transactionData = []
    for (let i = 0; i < ((this.transactionIDs.length < 10) ? this.transactionIDs.length : 10); i++) {
      this
        .transactionData
        .push
        (convertResponseToTransaction(await this
          .api
          .getTransactionDetailsByID
          (this.transactionIDs[i])).toJSON());
    }
    // this.transactionRows = new MatTableDataSource<transactionRow>(this.transactionData);
    // console.log(this.transactionRows)
  }
}
