import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaDetalhesComponent } from './materia-detalhes.component';

describe('MateriaDetalhesComponent', () => {
  let component: MateriaDetalhesComponent;
  let fixture: ComponentFixture<MateriaDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MateriaDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MateriaDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
