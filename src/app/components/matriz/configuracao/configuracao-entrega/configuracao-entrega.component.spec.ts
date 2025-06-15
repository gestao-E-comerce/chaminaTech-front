import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracaoEntregaComponent } from './configuracao-entrega.component';

describe('ConfiguracaoEntregaComponent', () => {
  let component: ConfiguracaoEntregaComponent;
  let fixture: ComponentFixture<ConfiguracaoEntregaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracaoEntregaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracaoEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
