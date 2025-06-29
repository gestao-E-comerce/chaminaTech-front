import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoCaixaComponent } from './historico-caixa.component';

describe('HistoricoCaixaComponent', () => {
  let component: HistoricoCaixaComponent;
  let fixture: ComponentFixture<HistoricoCaixaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoCaixaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoCaixaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
