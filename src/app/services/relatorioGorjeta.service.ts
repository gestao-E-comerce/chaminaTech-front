import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../config';
import { Pagina } from '../models/pagina';
import { Relatorio } from '../models/relatorio';
import { Gorjeta } from '../models/gorjeta';

@Injectable({
  providedIn: 'root',
})
export class RelatorioGorjetaService {
  private readonly API = `${Config.BACKEND_URL}/relatorio/gorjeta`;
  http = inject(HttpClient);

  gerarRelatorioGorjeta(relatorio: Relatorio): Observable<Pagina<Gorjeta>> {
    return this.http.post<Pagina<Gorjeta>>(
      `${this.API}/gerarRelatorioGorjeta`,
      relatorio
    );
  }
  gerarGraficoPagamentoGorjeta(relatorio: Relatorio): Observable<any> {
    return this.http.post<any>(`${this.API}/graficoPagamentoGorjeta`, relatorio);
  }

  gerarGraficoTotalGorjeta(relatorio: Relatorio): Observable<any[]> {
    return this.http.post<any[]>(`${this.API}/graficoTotalGorjeta`, relatorio);
  }
}
