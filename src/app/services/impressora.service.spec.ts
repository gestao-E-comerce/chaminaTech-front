import { TestBed } from '@angular/core/testing';

import { ImpressoraService } from './impressora.service';

describe('ImpressoraService', () => {
  let service: ImpressoraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpressoraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
