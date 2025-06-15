import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracaoRetiradaComponent } from './configuracao-retirada.component';

describe('ConfiguracaoRetiradaComponent', () => {
  let component: ConfiguracaoRetiradaComponent;
  let fixture: ComponentFixture<ConfiguracaoRetiradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracaoRetiradaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracaoRetiradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
