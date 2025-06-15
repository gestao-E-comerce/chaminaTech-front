import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Mensagem } from '../models/mensagem';
import { GlobalService } from './global.service';
import { Config } from '../../config';
import { ConfiguracaoRetirada } from '../models/configuracao-retirada';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracaoRetiradaService {
  private readonly API = `${Config.BACKEND_URL}/confRetirada`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  buscarConfiguracaoRetirada(): Observable<ConfiguracaoRetirada> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<ConfiguracaoRetirada>(`${this.API}/${matriz.id}`);
      })
    );
  }

  salvar(configuracaoRetirada: ConfiguracaoRetirada): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        configuracaoRetirada.matriz = matriz;
        return this.http.post<Mensagem>(this.API, configuracaoRetirada);
      })
    );
  }
}
