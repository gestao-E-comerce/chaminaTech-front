import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../config';
import { Relatorio } from '../models/relatorio';
import { ProdutoMaisVendido } from '../models/produtoMaisVendido';

@Injectable({
  providedIn: 'root',
})
export class RelatorioProdutoService {
  private readonly API = `${Config.BACKEND_URL}/relatorio/produto`;
  http = inject(HttpClient);

  gerarRelatorioProduto(relatorio: Relatorio): Observable<ProdutoMaisVendido[]> {
    return this.http.post<ProdutoMaisVendido[]>(
      `${this.API}/gerarRelatorioProduto`,
      relatorio
    );
  }

  graficoProdutoRetirada(relatorio: Relatorio): Observable<ProdutoMaisVendido[]> {
    return this.http.post<ProdutoMaisVendido[]>(
      `${this.API}/graficoProdutoRetirada`,
      relatorio
    );
  }

  graficoProdutoEntrega(relatorio: Relatorio): Observable<ProdutoMaisVendido[]> {
    return this.http.post<ProdutoMaisVendido[]>(
      `${this.API}/graficoProdutoEntrega`,
      relatorio
    );
  }

  graficoProdutoBalcao(relatorio: Relatorio): Observable<ProdutoMaisVendido[]> {
    return this.http.post<ProdutoMaisVendido[]>(
      `${this.API}/graficoProdutoBalcao`,
      relatorio
    );
  }

  graficoProdutoMesa(relatorio: Relatorio): Observable<ProdutoMaisVendido[]> {
    return this.http.post<ProdutoMaisVendido[]>(
      `${this.API}/graficoProdutoMesa`,
      relatorio
    );
  }
}
