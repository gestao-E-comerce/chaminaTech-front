import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Location } from '@angular/common';
import { catchError, map, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Permissao } from '../models/permissao';
import { GlobalService } from '../services/global.service';

export const rotaguardGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const globalService = inject(GlobalService);
  const router = inject(Router);
  const location = inject(Location);
  const toastr = inject(ToastrService);

  const token = loginService.getToken();
  const user = loginService.getUser();

  if (!token || !user?.id) {
    router.navigate(['/login']);
    return of(false);
  }

  const rotaParaPermissao: { [rota: string]: keyof Permissao } = {
    produto: 'produto',
    categoria: 'categoria',
    cliente: 'cliente',
    funcionario: 'funcionario',
    caixa: 'caixa',
    estoque: 'estoque',
    deposito: 'deposito',
    materia: 'materia',
    config: 'editarConfiguracoes',
    hisCaixas: 'historicoCaixa',
    hisVendas: 'historicoVenda',
    hisConsumos: 'historicoVenda',
    venda: 'venda',
    relatorios: 'relatorio',

    conf: 'editarConfiguracoes',
    funcionarios: 'funcionario',
    audit: 'auditoria',
    matriz: 'matrizPermissao',
  };

  if (state.url === '/home') {
    location.replaceState('/home');
    return of(true);
  }

  return globalService.getUsuarioAsync().pipe(
    map((usuario) => {
      const partesUrl = state.url.split('/').filter(Boolean);
      let rotaBase = partesUrl[0];
      let subRota = partesUrl[1];
      let permissaoNecessaria = rotaParaPermissao[rotaBase];
      let tipoCaixaOuVenda = partesUrl[1];

      if (rotaBase === 'historicos' && !subRota) {
        const temPermissao =
          usuario.permissao?.historicoCaixa ||
          usuario.permissao?.historicoVenda;
        if (!temPermissao) {
          toastr.error('Você não tem permissão para acessar os históricos.');
          router.navigate(['/home']);
          return false;
        }
        return true;
      }

      if (rotaBase === 'historicos' && subRota) {
        permissaoNecessaria = rotaParaPermissao[subRota];
      }

      if (rotaBase === 'venda') {
        const tiposValidos = ['mesa', 'retirada', 'entrega'];
        if (!tiposValidos.includes(tipoCaixaOuVenda)) {
          router.navigate(['/home']);
          return false;
        }
      }

      if (rotaBase === 'caixa') {
        const tiposValidos = ['mesa', 'retirada', 'entrega', 'balcao'];
        if (!tipoCaixaOuVenda || !tiposValidos.includes(tipoCaixaOuVenda)) {
          router.navigate(['/home']);
          return false;
        }
      }

      if (!permissaoNecessaria || !usuario.permissao?.[permissaoNecessaria]) {
        toastr.error('Você não tem permissão para acessar esta rota.');
        router.navigate(['/home']);
        return false;
      }

      return true;
    }),
    catchError(() => {
      toastr.error('Erro ao verificar permissões. Faça login novamente.');
      router.navigate(['/login']);
      return of(false);
    })
  );
};
