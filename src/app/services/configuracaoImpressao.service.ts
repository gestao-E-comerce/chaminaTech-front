import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Mensagem } from '../models/mensagem';
import { GlobalService } from './global.service';
import { Config } from '../../config';
import { ConfiguracaoImpressao } from '../models/configuracao-impressao';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracaoImpressaoService {
  private readonly API = `${Config.BACKEND_URL}/confImpressao`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  buscarConfiguracaoImpressao(): Observable<ConfiguracaoImpressao> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<ConfiguracaoImpressao>(`${this.API}/${matriz.id}`);
      })
    );
  }

  salvar(configuracaoImpressao: ConfiguracaoImpressao): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        configuracaoImpressao.matriz = matriz;
        return this.http.post<Mensagem>(this.API, configuracaoImpressao);
      })
    );
  }
}
