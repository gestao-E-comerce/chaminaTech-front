import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../config';
import { Pagina } from '../models/pagina';
import { Venda } from '../models/venda';
import { Relatorio } from '../models/relatorio';

@Injectable({
  providedIn: 'root',
})
export class RelatorioVendaService {
  private readonly API = `${Config.BACKEND_URL}/relatorio/venda`;
  http = inject(HttpClient);

  gerarRelatorioVenda(relatorio: Relatorio): Observable<Pagina<Venda>> {
    return this.http.post<Pagina<Venda>>(
      `${this.API}/gerarRelatorioVenda`,
      relatorio
    );
  }
  gerarGraficoValorTotalVenda(relatorio: Relatorio): Observable<any[]> {
    return this.http.post<any[]>(`${this.API}/graficoValorTotalVenda`, relatorio);
  }
  gerarGraficoPagamentoVenda(relatorio: Relatorio): Observable<any> {
    return this.http.post<any>(`${this.API}/graficoPagamentoVenda`, relatorio);
  }
  gerarGraficoTipoVendaVenda(relatorio: Relatorio): Observable<any> {
    return this.http.post<any>(`${this.API}/graficoTipoVendaVenda`, relatorio);
  }
  gerarGraficoPeriodoVenda(relatorio: Relatorio): Observable<any> {
    return this.http.post<any>(`${this.API}/graficoPeriodoVenda`, relatorio);
  }
}
