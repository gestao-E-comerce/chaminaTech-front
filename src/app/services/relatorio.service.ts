import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Mensagem } from '../models/mensagem';
import { GlobalService } from './global.service';
import { Config } from '../../config';
import { Relatorio } from '../models/relatorio';

@Injectable({
  providedIn: 'root',
})
export class RelatorioService {
  private readonly API = `${Config.BACKEND_URL}/relatorio`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  buscarPorId(id: number): Observable<Relatorio> {
    return this.http.get<Relatorio>(this.API + '/' + `${id}`);
  }

  listarRelatorios(): Observable<Relatorio[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<Relatorio[]>(`${this.API}/lista/${matriz.id}`);
      })
    );
  }

  save(relatorio: Relatorio): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        relatorio.matriz = matriz;
        if (relatorio.id) {
          return this.http.put<Mensagem>(
            `${this.API}/${relatorio.id}`,
            relatorio
          );
        } else {
          return this.http.post<Mensagem>(this.API, relatorio);
        }
      })
    );
  }

  deletar(id: number): Observable<Mensagem> {
    return this.http.delete<Mensagem>(`${this.API}/${id}`);
  }
}
