import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SangriaComponent } from './sangria.component';

describe('SangriaComponent', () => {
  let component: SangriaComponent;
  let fixture: ComponentFixture<SangriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SangriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SangriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
