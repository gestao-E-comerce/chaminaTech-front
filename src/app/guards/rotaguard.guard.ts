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
    caixaConf: 'historicoCaixa',
    venda: 'venda',
    
    conf: 'editarConfiguracoes',
    funcionarios: 'funcionario',
    audit: 'auditoria',
    matriz: 'matrizPermissao'
  };

  if (state.url === '/home') {
    location.replaceState('/home');
    return of(true);
  }

  return globalService.getUsuarioAsync().pipe(
    map((usuario) => {
      const rotaBase = state.url.split('/')[1]; // ex: 'produtos'
      const permissaoNecessaria = rotaParaPermissao[rotaBase];

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