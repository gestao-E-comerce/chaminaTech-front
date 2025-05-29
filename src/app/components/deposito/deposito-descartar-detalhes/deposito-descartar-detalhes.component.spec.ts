import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositoDescartarDetalhesComponent } from './deposito-descartar-detalhes.component';

describe('DepositoDescartarDetalhesComponent', () => {
  let component: DepositoDescartarDetalhesComponent;
  let fixture: ComponentFixture<DepositoDescartarDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositoDescartarDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositoDescartarDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
