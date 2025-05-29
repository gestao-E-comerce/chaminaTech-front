import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositoListComponent } from './deposito-list.component';

describe('DepositoListComponent', () => {
  let component: DepositoListComponent;
  let fixture: ComponentFixture<DepositoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
