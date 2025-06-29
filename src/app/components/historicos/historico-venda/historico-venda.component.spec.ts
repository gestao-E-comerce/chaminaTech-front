import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoVendaComponent } from './historico-venda.component';

describe('HistoricoVendaComponent', () => {
  let component: HistoricoVendaComponent;
  let fixture: ComponentFixture<HistoricoVendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoVendaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoVendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
