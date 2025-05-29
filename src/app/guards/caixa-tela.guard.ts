import { CanDeactivateFn } from '@angular/router';
import { CaixaTelaComponent } from '../components/caixa/caixa-tela/caixa-tela.component';
import { catchError, Observable, of, take, tap } from 'rxjs';

export const caixaTelaGuard: CanDeactivateFn<CaixaTelaComponent> = (component): Observable<boolean> => {
  return component.cancelar().pipe(
    take(1),
    tap((podeSair) => {
    }),
    catchError((err) => {
      return of(false);
    })
  );
};