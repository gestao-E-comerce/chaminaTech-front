import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoqueDescartarDetalhesComponent } from './estoque-descartar-detalhes.component';

describe('EstoqueDescartarDetalhesComponent', () => {
  let component: EstoqueDescartarDetalhesComponent;
  let fixture: ComponentFixture<EstoqueDescartarDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstoqueDescartarDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstoqueDescartarDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
