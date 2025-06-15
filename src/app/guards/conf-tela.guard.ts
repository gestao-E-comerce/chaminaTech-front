import { CanDeactivateFn } from '@angular/router';
import { catchError, Observable, of, take, tap } from 'rxjs';
import { ConfiguracaoEntregaComponent } from '../components/matriz/configuracao/configuracao-entrega/configuracao-entrega.component';
import { ConfiguracaoRetiradaComponent } from '../components/matriz/configuracao/configuracao-retirada/configuracao-retirada.component';
import { ConfiguracaoImpressaoComponent } from '../components/matriz/configuracao/configuracao-impressao/configuracao-impressao.component';
import { ConfiguracaoPerfilComponent } from '../components/matriz/configuracao/configuracao-perfil/configuracao-perfil.component';
import { ConfiguracaoTaxaServicoComponent } from '../components/matriz/configuracao/configuracao-taxa-servico/configuracao-taxa-servico.component';

type ConfigComponents =
  | ConfiguracaoEntregaComponent
  | ConfiguracaoRetiradaComponent
  | ConfiguracaoImpressaoComponent
  | ConfiguracaoPerfilComponent
  | ConfiguracaoTaxaServicoComponent;

export const confTelaGuard: CanDeactivateFn<ConfigComponents> = (
  component
): Observable<boolean> => {
  if (typeof component.cancelar === 'function') {
    return component.cancelar().pipe(
      take(1),
      catchError(() => of(false))
    );
  } else {
    return of(true);
  }
};
