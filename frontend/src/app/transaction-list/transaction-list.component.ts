import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../api.service';
import { convertResponseToTransaction, TransactionResponse, Transaction, transactionRow } from '../transaction';
import {MatTableDataSource, MatTable} from '@angular/material/table'
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'

/**
 * @name TransactionListComponent
 * @description Displays a table of transactions. Clicking a transactionID
 * allows one to peruse the details of that specific transaction.
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
  transactionData: transactionRow[] = [];
  transactionColumns = ['transactionID','senderAccNum'];
  //transactionJSONArray = [];
  constructor(
    private api: ApiService,
    public dialog: MatDialog
  ) {

  }

  async ngOnInit() {
    this.transactionCount =
      (await this.api.getTransactionCountByID(this.api.fullID)).count
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

  onClick(transaction: transactionRow){
    console.log(transaction)
    this.openDialog(transaction)
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

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.html'
})
export class TransactionDialog {
  totalCredits = 0;
  constructor(
    public dialogRef: MatDialogRef<TransactionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: transactionRow
  ){
    for(let i  = 0; i < data.mutations['fields'].length; i++){
      let field = data.mutations['fields'][i]
      let val = data.mutations['vals'][i]
      if(field.substr(4,4) == '0000'){
        this.totalCredits += val
      }
    }
    this.totalCredits = data.amt + data.mutations['vals'][0] + data.mutations['vals'][1]
  }

}