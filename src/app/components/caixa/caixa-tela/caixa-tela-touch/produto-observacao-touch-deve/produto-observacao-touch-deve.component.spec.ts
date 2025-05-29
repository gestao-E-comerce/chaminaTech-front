import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoObservacaoTouchDeveComponent } from './produto-observacao-touch-deve.component';

describe('ProdutoObservacaoTouchDeveComponent', () => {
  let component: ProdutoObservacaoTouchDeveComponent;
  let fixture: ComponentFixture<ProdutoObservacaoTouchDeveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoObservacaoTouchDeveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoObservacaoTouchDeveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
