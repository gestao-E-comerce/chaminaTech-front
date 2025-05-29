import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagarParcialComponent } from './pagar-parcial.component';

describe('PagarParcialComponent', () => {
  let component: PagarParcialComponent;
  let fixture: ComponentFixture<PagarParcialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagarParcialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagarParcialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
