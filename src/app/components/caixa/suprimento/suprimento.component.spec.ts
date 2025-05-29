import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuprimentoComponent } from './suprimento.component';

describe('SuprimentoComponent', () => {
  let component: SuprimentoComponent;
  let fixture: ComponentFixture<SuprimentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuprimentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuprimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
