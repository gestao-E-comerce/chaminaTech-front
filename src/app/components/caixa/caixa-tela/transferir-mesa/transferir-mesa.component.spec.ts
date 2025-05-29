import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferirMesaComponent } from './transferir-mesa.component';

describe('TransferirMesaComponent', () => {
  let component: TransferirMesaComponent;
  let fixture: ComponentFixture<TransferirMesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferirMesaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferirMesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
