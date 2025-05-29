import { CanDeactivateFn } from '@angular/router';
import { catchError, Observable, of, take, tap } from 'rxjs';
import { ConfiguracaoComponent } from '../components/matriz/configuracao/configuracao.component';

export const confTelaGuard: CanDeactivateFn<ConfiguracaoComponent> = (component): Observable<boolean> => {
  return component.cancelar().pipe(
    take(1),
    tap((podeSair) => {
    }),
    catchError((err) => {
      return of(false);
    })
  );
};