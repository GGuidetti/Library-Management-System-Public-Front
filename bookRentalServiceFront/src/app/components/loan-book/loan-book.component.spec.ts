import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanBookComponent } from './loan-book.component';

describe('LoanBookComponent', () => {
  let component: LoanBookComponent;
  let fixture: ComponentFixture<LoanBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
