import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { GestaoCaixa } from '../models/gestao-caixa';
import { GlobalService } from './global.service';
import { Mensagem } from '../models/mensagem';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class GestaoCaixaService {
  private readonly API = `${Config.BACKEND_URL}/api/gestaoCaixa`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  buscarPorId(id: number): Observable<GestaoCaixa> {
    return this.http.get<GestaoCaixa>(this.API + '/' + `${id}`);
  }
  findByCupomAndAtivoAndEntregaAndMatrizId(
    numeroCupom: number
  ): Observable<GestaoCaixa> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<GestaoCaixa>(
          `${this.API}/cupom/${numeroCupom}/matriz/${matriz.id}/entrega`
        );
      })
    );
  }

  findByCupomAndAtivoAndRetiradaAndMatrizId(
    numeroCupom: number
  ): Observable<GestaoCaixa> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<GestaoCaixa>(
          `${this.API}/cupom/${numeroCupom}/matriz/${matriz.id}/retirada`
        );
      })
    );
  }

  buscarCuponsEntregaByMatrizId(): Observable<
    {
      numero: number;
      statusEmAberto: boolean;
      statusEmPagamento: boolean;
      cliente: string;
      id: number;
      dataVenda: string;
      tempoPrevisto: number;
    }[]
  > {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<
          {
            numero: number;
            statusEmAberto: boolean;
            statusEmPagamento: boolean;
            cliente: string;
            id: number;
            dataVenda: string;
            tempoPrevisto: number;
          }[]
        >(`${this.API}/cuponsEntregaAtivos/${matriz.id}`);
      })
    );
  }

  buscarCuponsRetiradaByMatrizId(): Observable<
    {
      numero: number;
      statusEmAberto: boolean;
      statusEmPagamento: boolean;
      cliente: string;
      id: number;
      dataVenda: string;
      tempoPrevisto: number;
    }[]
  > {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<
          {
            numero: number;
            statusEmAberto: boolean;
            statusEmPagamento: boolean;
            cliente: string;
            id: number;
            dataVenda: string;
            tempoPrevisto: number;
          }[]
        >(`${this.API}/cuponsRetiradaAtivos/${matriz.id}`);
      })
    );
  }
  buscarCuponsHistorico(
    tipo?: string,
    cupom?: number
  ): Observable<GestaoCaixa[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        let params = new HttpParams().set('matrizId', matriz.id.toString());
        if (tipo) {
          params = params.set('tipo', tipo);
        }
        if (cupom != null) {
          params = params.set('cupom', cupom.toString());
        }
        return this.http.get<GestaoCaixa[]>(`${this.API}/historico`, {
          params,
        });
      })
    );
  }

  zerarCupons(): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.patch<Mensagem>(
          `${this.API}/${matriz.id}/zerarCupom`,
          {}
        );
      })
    );
  }
}
