import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioDetalhesComponent } from './funcionario-detalhes.component';

describe('FuncionarioDetalhesComponent', () => {
  let component: FuncionarioDetalhesComponent;
  let fixture: ComponentFixture<FuncionarioDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionarioDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncionarioDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
