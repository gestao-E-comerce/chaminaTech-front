import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFuncionarioDetalhesComponent } from './admin-funcionario-detalhes.component';

describe('AdminFuncionarioDetalhesComponent', () => {
  let component: AdminFuncionarioDetalhesComponent;
  let fixture: ComponentFixture<AdminFuncionarioDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFuncionarioDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFuncionarioDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
