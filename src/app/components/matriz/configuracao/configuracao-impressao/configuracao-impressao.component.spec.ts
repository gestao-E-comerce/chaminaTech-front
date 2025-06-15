import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracaoImpressaoComponent } from './configuracao-impressao.component';

describe('ConfiguracaoImpressaoComponent', () => {
  let component: ConfiguracaoImpressaoComponent;
  let fixture: ComponentFixture<ConfiguracaoImpressaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracaoImpressaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracaoImpressaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
