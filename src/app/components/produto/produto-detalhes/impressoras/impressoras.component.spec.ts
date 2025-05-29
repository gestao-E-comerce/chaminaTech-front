import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpressorasComponent } from './impressoras.component';

describe('ImpressorasComponent', () => {
  let component: ImpressorasComponent;
  let fixture: ComponentFixture<ImpressorasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpressorasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpressorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
