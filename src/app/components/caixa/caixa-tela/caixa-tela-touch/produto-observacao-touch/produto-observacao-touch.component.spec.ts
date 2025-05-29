import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoObservacaoTouchComponent } from './produto-observacao-touch.component';

describe('ProdutoObservacaoTouchComponent', () => {
  let component: ProdutoObservacaoTouchComponent;
  let fixture: ComponentFixture<ProdutoObservacaoTouchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoObservacaoTouchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoObservacaoTouchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
