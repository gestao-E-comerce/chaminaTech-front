import { TestBed } from '@angular/core/testing';

import { SangriaService } from './sangria.service';

describe('SangriaService', () => {
  let service: SangriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SangriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
