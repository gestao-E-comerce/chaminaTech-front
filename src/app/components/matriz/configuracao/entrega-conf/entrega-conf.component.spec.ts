import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregaConfComponent } from './entrega-conf.component';

describe('EntregaConfComponent', () => {
  let component: EntregaConfComponent;
  let fixture: ComponentFixture<EntregaConfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregaConfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregaConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
