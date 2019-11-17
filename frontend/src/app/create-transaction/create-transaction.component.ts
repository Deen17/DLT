import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionRequest, ApiService, TransactionForm } from '../api.service';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.css']
})
export class CreateTransactionComponent implements OnInit {
  @ViewChild('routingNum') receiverRoutingNum;
  @ViewChild('accountNum') receiverAccountNum;
  @ViewChild('amt') amount;
  @ViewChild('instrument') instrument;
  constructor(
    private api: ApiService
  ) { }

  async onSubmit() {
    let req: TransactionRequest =
      new TransactionForm(
        this.receiverAccountNum.nativeElement.value,
        this.receiverRoutingNum.nativeElement.value,
        +this.amount.nativeElement.value,
        this.instrument.nativeElement.value
      ).toTransactionRequest(
        this.api.accNum,
        this.api.routingNum)
    console.log(req)
    let response = await this.api.postTransaction(
      req)
    console.log(response)
    if (response.response == "0"){
      alert('transaction completed!')
    }
  }

  ngOnInit() {
  }

}

