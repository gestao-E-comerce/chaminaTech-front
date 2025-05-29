import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizDetalhesComponent } from './matriz-detalhes.component';

describe('MatrizDetalhesComponent', () => {
  let component: MatrizDetalhesComponent;
  let fixture: ComponentFixture<MatrizDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrizDetalhesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatrizDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
