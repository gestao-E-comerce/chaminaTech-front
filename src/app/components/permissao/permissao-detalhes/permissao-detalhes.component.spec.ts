import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissaoDetalhesComponent } from './permissao-detalhes.component';

describe('PermissaoDetalhesComponent', () => {
  let component: PermissaoDetalhesComponent;
  let fixture: ComponentFixture<PermissaoDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissaoDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissaoDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
