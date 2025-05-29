import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaixaTelaComponent } from './caixa-tela.component';

describe('CaixaTelaComponent', () => {
  let component: CaixaTelaComponent;
  let fixture: ComponentFixture<CaixaTelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaixaTelaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaixaTelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
