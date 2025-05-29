import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacaoDetalhesComponent } from './observacao-detalhes.component';

describe('ObservacaoDetalhesComponent', () => {
  let component: ObservacaoDetalhesComponent;
  let fixture: ComponentFixture<ObservacaoDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservacaoDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservacaoDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
