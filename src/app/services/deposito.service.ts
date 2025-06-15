import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Deposito } from '../models/deposito';
import { Mensagem } from '../models/mensagem';
import { GlobalService } from './global.service';
import { DepositoDescartar } from '../models/deposito-descartar';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class DepositoService {
  private readonly API = `${Config.BACKEND_URL}/deposito`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  listarDepositos(
    materiaNome?: string,
    ativo?: string
  ): Observable<Deposito[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        let params = new HttpParams().set('matrizId', matriz.id.toString());
        if (ativo != null && ativo !== '') {
          params = params.set('ativo', ativo);
        }
        if (materiaNome != null && materiaNome !== '') {
          params = params.set('materiaNome', materiaNome);
        }
        return this.http.get<Deposito[]>(`${this.API}/lista`, {
          params,
        });
      })
    );
  }

  save(deposito: Deposito): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        deposito.matriz = matriz;
        if (deposito.id) {
          return this.http.put<Mensagem>(
            `${this.API}/${deposito.id}`,
            deposito
          );
        } else {
          return this.http.post<Mensagem>(this.API, deposito);
        }
      })
    );
  }

  ativarOuDesativarDeposito(deposito: Deposito): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        deposito.matriz = matriz;
        return this.http.put<Mensagem>(
          `${this.API}/desativar/${deposito.id}`,
          deposito
        );
      })
    );
  }

  descartar(depositoDescartar: DepositoDescartar): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        depositoDescartar.matriz = matriz;
        return this.http.post<Mensagem>(this.API + '/descartar', depositoDescartar);
      })
    );
  }

  listarDepositosDescartados(
    materiaNome?: string
  ): Observable<DepositoDescartar[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        let params = new HttpParams().set('matrizId', matriz.id.toString());
        if (materiaNome != null && materiaNome !== '') {
          params = params.set('materiaNome', materiaNome);
        }
        return this.http.get<DepositoDescartar[]>(`${this.API}/listaDescartados`, {
          params,
        });
      })
    );
  }
}
