import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { caixaTelaGuard } from './caixa-tela.guard';

describe('caixaTelaGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => caixaTelaGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
