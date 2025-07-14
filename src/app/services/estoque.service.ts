import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Estoque } from '../models/estoque';
import { Mensagem } from '../models/mensagem';
import { GlobalService } from './global.service';
import { EstoqueDescartar } from '../models/estoque-descartar';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class EstoqueService {
  private readonly API = `${Config.BACKEND_URL}/estoque`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  listarEstoques(produtoNome?: string, ativo?: string | null): Observable<Estoque[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        let params = new HttpParams().set('matrizId', matriz.id.toString());
        if (ativo != null && ativo !== '') {
          params = params.set('ativo', ativo);
        }
        if (produtoNome != null && produtoNome !== '') {
          params = params.set('produtoNome', produtoNome);
        }
        return this.http.get<Estoque[]>(`${this.API}/lista`, {
          params,
        });
      })
    );
  }

  save(estoque: Estoque): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        estoque.matriz = matriz;
        if (estoque.id) {
          return this.http.put<Mensagem>(`${this.API}/${estoque.id}`, estoque);
        } else {
          return this.http.post<Mensagem>(this.API, estoque);
        }
      })
    );
  }

  descartar(estoqueDescartar: EstoqueDescartar): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        estoqueDescartar.matriz = matriz;
        return this.http.post<Mensagem>(this.API + '/descartar', estoqueDescartar);
      })
    );
  }

  ativarOuDesativarEstoque(estoque: Estoque): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        estoque.matriz = matriz;
        return this.http.put<Mensagem>(
          `${this.API}/desativar/${estoque.id}`,
          estoque
        );
      })
    );
  }
  listarEstoquesDescartar(produtoNome?: string): Observable<EstoqueDescartar[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        let params = new HttpParams().set('matrizId', matriz.id.toString());
        if (produtoNome != null && produtoNome !== '') {
          params = params.set('produtoNome', produtoNome);
        }
        return this.http.get<EstoqueDescartar[]>(`${this.API}/listaDescartados`, {
          params,
        });
      })
    );
  }
}
