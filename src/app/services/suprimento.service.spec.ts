import { TestBed } from '@angular/core/testing';

import { SuprimentoService } from './suprimento.service';

describe('SuprimentoService', () => {
  let service: SuprimentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuprimentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
