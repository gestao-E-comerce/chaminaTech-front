import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProdutosSelecionarComponent } from './lista-produtos-selecionar.component';

describe('ListaProdutosSelecionarComponent', () => {
  let component: ListaProdutosSelecionarComponent;
  let fixture: ComponentFixture<ListaProdutosSelecionarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaProdutosSelecionarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaProdutosSelecionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
