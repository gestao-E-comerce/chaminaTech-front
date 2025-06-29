import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Mensagem } from '../models/mensagem';
import { GlobalService } from './global.service';
import { Config } from '../../config';
import { ConfiguracaoTaxaServico } from '../models/configuracao-taxa-servico';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracaoTaxaServicoService {
  private readonly API = `${Config.BACKEND_URL}/confTaxaServico`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  buscarconfiguracaoTaxaServico(): Observable<ConfiguracaoTaxaServico> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<ConfiguracaoTaxaServico>(
          `${this.API}/${matriz.id}`
        );
      })
    );
  }

  salvar(
    configuracaoTaxaServico: ConfiguracaoTaxaServico
  ): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        configuracaoTaxaServico.matriz = matriz;
        return this.http.post<Mensagem>(this.API, configuracaoTaxaServico);
      })
    );
  }
}
