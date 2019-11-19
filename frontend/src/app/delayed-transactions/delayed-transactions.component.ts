import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../api.service';
import { convertResponseToTransaction, TransactionResponse, Transaction, transactionRow } from '../transaction';
import { MatTableDataSource, MatTable } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { delay } from 'q';
import { Router } from '@angular/router';


/**
 * @name DelayedTransactionsComponent
 * @description Displays a table of delayed transactions. Clicking a transactionID
 * allows one to peruse the details of that specific transaction. Click "Accept" on a
 * transaction to 'un-delay' it.
 * 
 */
@Component({
  selector: 'app-delayed-transactions',
  templateUrl: './delayed-transactions.component.html',
  styleUrls: ['./delayed-transactions.component.css']
})
export class DelayedTransactionsComponent implements OnInit {
  transactionCount: number;
  delayedIDs: string[];
  delayedTransactionData: transactionRow[] = [];

  constructor(
    private api: ApiService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  async onClick(transaction: transactionRow) {
    // const dialogRef = this.dialog.open(TransactionDialog, {
    //   width: '500opx',
    //   data: transaction
    // }
    // )
    let response: string = (await this.api.postUndelay(
      transaction
    )).response

    if(response == "0")
      alert('transaction successfully undelayed!')
  }

  openDialog(transaction: transactionRow): void {
    const dialogRef = this.dialog.open(TransactionDialog, {
      width: '500px',
      data: transaction
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }

  async ngOnInit() {
    this.transactionCount =
      (await this.api.getDelayedTransactionCountByBankID(this.api.routingNum)).count
    console.log('transactioncount: ', this.transactionCount)

    let response = await
      this
        .api
        .getDelayedTransactionsByStartEnd(
          this.api.routingNum,
          0,
          10
        )
    this.delayedIDs = response.transactions
    console.log(this.delayedIDs)

    await this.fetchDelayedTransactionData()
    console.log(this.delayedTransactionData)
  }

  async fetchDelayedTransactionData() {
    this.delayedTransactionData = []
    for (let i = 0; i < ((this.delayedIDs.length < 10) ? this.delayedIDs.length : 10); i++) {
      this
        .delayedTransactionData
        .push
        (convertResponseToTransaction(await this
          .api
          .getDelayedTransactionDetailsByID
          (this.delayedIDs[i])).toJSON());
    }
  }

}

@Component({
  selector: 'app-delayed-transaction-dialog',
  templateUrl: './delayed-transaction-dialog.html'
})
export class TransactionDialog {
  constructor(
    public dialogRef: MatDialogRef<TransactionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: transactionRow
  ) {

  }

}