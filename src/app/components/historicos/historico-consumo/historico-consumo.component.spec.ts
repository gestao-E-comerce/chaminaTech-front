import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoConsumoComponent } from './historico-consumo.component';

describe('HistoricoConsumoComponent', () => {
  let component: HistoricoConsumoComponent;
  let fixture: ComponentFixture<HistoricoConsumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoConsumoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoConsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
