import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayedTransactionsListComponent } from './delayed-transactions-list.component';

describe('DelayedTransactionsListComponent', () => {
  let component: DelayedTransactionsListComponent;
  let fixture: ComponentFixture<DelayedTransactionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelayedTransactionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelayedTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
