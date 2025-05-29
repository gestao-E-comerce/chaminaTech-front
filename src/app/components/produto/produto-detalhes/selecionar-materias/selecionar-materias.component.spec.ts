import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecionarMateriasComponent } from './selecionar-materias.component';

describe('SelecionarMateriasComponent', () => {
  let component: SelecionarMateriasComponent;
  let fixture: ComponentFixture<SelecionarMateriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelecionarMateriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecionarMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
