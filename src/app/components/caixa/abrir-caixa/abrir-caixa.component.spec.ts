import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbrirCaixaComponent } from './abrir-caixa.component';

describe('AbrirCaixaComponent', () => {
  let component: AbrirCaixaComponent;
  let fixture: ComponentFixture<AbrirCaixaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbrirCaixaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbrirCaixaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
