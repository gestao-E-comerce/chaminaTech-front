import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracaoTaxaServicoComponent } from './configuracao-taxa-servico.component';

describe('ConfiguracaoTaxaServicoComponent', () => {
  let component: ConfiguracaoTaxaServicoComponent;
  let fixture: ComponentFixture<ConfiguracaoTaxaServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracaoTaxaServicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracaoTaxaServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
