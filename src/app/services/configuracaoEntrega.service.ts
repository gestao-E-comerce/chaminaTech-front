import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Mensagem } from '../models/mensagem';
import { GlobalService } from './global.service';
import { Config } from '../../config';
import { ConfiguracaoEntrega } from '../models/configuracao-entrega';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracaoEntregaService {
  private readonly API = `${Config.BACKEND_URL}/confEntrega`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  buscarConfiguracaoEntrega(): Observable<ConfiguracaoEntrega> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<ConfiguracaoEntrega>(`${this.API}/${matriz.id}`);
      })
    );
  }

  salvar(configuracaoEntrega: ConfiguracaoEntrega): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        configuracaoEntrega.matriz = matriz;
        return this.http.post<Mensagem>(this.API, configuracaoEntrega);
      })
    );
  }
}
