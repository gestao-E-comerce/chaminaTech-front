import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissaoListaComponent } from './permissao-lista.component';

describe('PermissaoListaComponent', () => {
  let component: PermissaoListaComponent;
  let fixture: ComponentFixture<PermissaoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissaoListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissaoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
