import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecionarProdutosComponent } from './selecionar-produtos.component';

describe('SelecionarProdutosComponent', () => {
  let component: SelecionarProdutosComponent;
  let fixture: ComponentFixture<SelecionarProdutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelecionarProdutosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecionarProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
