import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagamentoParcialComponent } from './pagamento-parcial.component';

describe('PagamentoParcialComponent', () => {
  let component: PagamentoParcialComponent;
  let fixture: ComponentFixture<PagamentoParcialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagamentoParcialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagamentoParcialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
