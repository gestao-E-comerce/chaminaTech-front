import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpressorasMatrizComponent } from './impressoras-matriz.component';

describe('ImpressorasMatrizComponent', () => {
  let component: ImpressorasMatrizComponent;
  let fixture: ComponentFixture<ImpressorasMatrizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpressorasMatrizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpressorasMatrizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
