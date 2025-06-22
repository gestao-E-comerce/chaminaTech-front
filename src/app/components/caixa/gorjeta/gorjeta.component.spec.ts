import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GorjetaComponent } from './gorjeta.component';

describe('GorjetaComponent', () => {
  let component: GorjetaComponent;
  let fixture: ComponentFixture<GorjetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GorjetaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GorjetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
