import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, identity, Subscription, asyncScheduler } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {
  balance: number;
  name: string;
  ID: string;
  balanceUpdates: Observable<number>
  subscription: Subscription;

  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  async ngOnInit() {
    let response = await this.api.getUserDetailsByID(this.api.fullID);
    console.log(response)
    this.balance = response.balance;
    this.name = response.name;
    this.ID = this.api.fullID;
    
    //this.subscribeToUpdates();

    async function task(state){
      let response = await state.api.getUserDetailsByID(state.api.fullID);
      state.balance = response.balance
      this.schedule(state,1000)
    }

    this.subscription = asyncScheduler.schedule(
      task,
      1000,
      await this
    )
  }

  private subscribeToUpdates(){
    const source = interval(1000)
    this.balanceUpdates = source.pipe(
      x => identity(x)
    )
  }

  async ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
