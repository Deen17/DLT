import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayedTransactionsComponent } from './delayed-transactions.component';

describe('DelayedTransactionsComponent', () => {
  let component: DelayedTransactionsComponent;
  let fixture: ComponentFixture<DelayedTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelayedTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelayedTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
