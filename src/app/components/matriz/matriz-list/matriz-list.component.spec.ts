import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizListComponent } from './matriz-list.component';

describe('MatrizListComponent', () => {
  let component: MatrizListComponent;
  let fixture: ComponentFixture<MatrizListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrizListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatrizListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
