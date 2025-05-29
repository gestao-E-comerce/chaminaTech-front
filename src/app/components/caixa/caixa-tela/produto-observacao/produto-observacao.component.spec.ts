import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoObservacaoComponent } from './produto-observacao.component';

describe('ProdutoObservacaoComponent', () => {
  let component: ProdutoObservacaoComponent;
  let fixture: ComponentFixture<ProdutoObservacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoObservacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoObservacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
