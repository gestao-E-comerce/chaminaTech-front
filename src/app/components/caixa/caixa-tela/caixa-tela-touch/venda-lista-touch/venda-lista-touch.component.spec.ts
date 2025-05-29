import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaListaTouchComponent } from './venda-lista-touch.component';

describe('VendaListaTouchComponent', () => {
  let component: VendaListaTouchComponent;
  let fixture: ComponentFixture<VendaListaTouchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendaListaTouchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendaListaTouchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
