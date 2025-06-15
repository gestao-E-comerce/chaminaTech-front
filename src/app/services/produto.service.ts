import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Mensagem } from '../models/mensagem';
import { Produto } from '../models/produto';
import { GlobalService } from './global.service';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private readonly API = `${Config.BACKEND_URL}/produto`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  obterProdutoPorCodigoEMatriz(codigo: number): Observable<Produto> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<Produto>(
          `${this.API}/codigo/${codigo}/matriz/${matriz.id}`
        );
      })
    );
  }

  listarProdutos(
    ativo?: string,
    cardapio?: string,
    estocavel?: string,
    validarExestencia?: string,
    categoriaNome?: string,
    nome?: string
  ): Observable<Produto[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        let params = new HttpParams().set('matrizId', matriz.id.toString());

        if (ativo != null && ativo !== '') {
          params = params.set('ativo', ativo);
        }
        if (cardapio != null && cardapio !== '') {
          params = params.set('cardapio', cardapio);
        }
        if (estocavel != null && estocavel !== '') {
          params = params.set('estocavel', estocavel);
        }
        if (validarExestencia != null && validarExestencia !== '') {
          params = params.set('validarExestencia', validarExestencia);
        }
        if (categoriaNome != null && categoriaNome !== '') {
          params = params.set('categoriaNome', categoriaNome);
        }
        if (nome != null && nome !== '') {
          params = params.set('nome', nome);
        }
        return this.http.get<Produto[]>(`${this.API}/lista`, {
          params,
        });
      })
    );
  }

  listarProdutosEstoque(termoPesquisa?: string): Observable<Produto[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        let params = new HttpParams().set('matrizId', matriz.id.toString());
        if (termoPesquisa != null && termoPesquisa !== '') {
          params = params.set('termoPesquisa', termoPesquisa);
        }
        return this.http.get<Produto[]>(`${this.API}/listarProdutosEstoque`, {
          params,
        });
      })
    );
  }

  listarProdutosEstoqueDescartar(termoPesquisa?: string): Observable<Produto[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        let params = new HttpParams().set('matrizId', matriz.id.toString());
        if (termoPesquisa != null && termoPesquisa !== '') {
          params = params.set('termoPesquisa', termoPesquisa);
        }
        return this.http.get<Produto[]>(`${this.API}/listarProdutosEstoqueDescartados`, {
          params,
        });
      })
    );
  }

  save(produto: Produto): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        produto.matriz = matriz;
        if (produto.id) {
          return this.http.put<Mensagem>(`${this.API}/${produto.id}`, produto);
        } else {
          return this.http.post<Mensagem>(this.API, produto);
        }
      })
    );
  }

  ativarOuDesativarProduto(produto: Produto): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        produto.matriz = matriz;
        return this.http.put<Mensagem>(
          `${this.API}/desativar/${produto.id}`,
          produto
        );
      })
    );
  }

  deletar(id: number): Observable<Mensagem> {
    return this.http.delete<Mensagem>(`${this.API}/${id}`);
  }
}
