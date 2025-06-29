import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaixaConfiguracaoComponent } from './historicos.component';

describe('CaixaConfiguracaoComponent', () => {
  let component: CaixaConfiguracaoComponent;
  let fixture: ComponentFixture<CaixaConfiguracaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaixaConfiguracaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaixaConfiguracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
